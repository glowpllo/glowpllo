import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export default {
    data: new SlashCommandBuilder()
        .setName('lastseen')
        .setDescription('Mostra a última vez que MrWindy foi visto no DevForum'),

    async execute(interaction) {
        await interaction.deferReply(); // Importante para operações que podem demorar

        try {
            const lastSeen = await this.getLastSeenFromForum();
            
            if (lastSeen) {
                const embed = new EmbedBuilder()
                    .setTitle('📅 Última atividade do MrWindy no DevForum')
                    .setDescription(`Última vez visto: **${lastSeen}**`)
                    .setColor(0x00AE86)
                    .setFooter({ text: 'Fonte: devforum.roblox.com' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply('❌ Não foi possível obter as informações do DevForum no momento. O site pode estar com proteções anti-bot ativas.');
            }

        } catch (error) {
            console.error('Erro ao buscar dados do DevForum:', error);
            await interaction.editReply('❌ Ocorreu um erro ao buscar as informações no DevForum.');
        }
    },

    async getLastSeenFromForum() {
        const strategies = [
            { name: 'API Discourse', method: () => this.tryDiscourseAPI() },
            { name: 'Scraping Mobile', method: () => this.tryMobileScraping() },
            { name: 'Scraping Desktop', method: () => this.tryDesktopScraping() },
            { name: 'Método Legacy', method: () => this.tryLegacyMethod() },
            { name: 'Backup Method', method: () => this.tryBackupMethod() }
        ];

        for (const strategy of strategies) {
            try {
                console.log(`Tentando estratégia: ${strategy.name}`);
                const result = await strategy.method();
                if (result) {
                    console.log(`✅ Sucesso com estratégia: ${strategy.name}`);
                    return result;
                }
            } catch (error) {
                console.log(`❌ Falha na estratégia ${strategy.name}:`, error.message);
                
                // Delay entre tentativas para não parecer bot
                await this.randomDelay();
                continue;
            }
        }

        return null;
    },

    async randomDelay() {
        const delay = 2000 + Math.random() * 3000; // 2-5 segundos
        await new Promise(resolve => setTimeout(resolve, delay));
    },

    getRandomUserAgent() {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    },

    async tryDiscourseAPI() {
        const response = await axios.get('https://devforum.roblox.com/users/mrwindy.json', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': this.getRandomUserAgent(),
                'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://devforum.roblox.com/u/mrwindy',
            },
            timeout: 15000,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                secureProtocol: 'TLSv1_2_method'
            })
        });

        if (response.data?.user?.last_seen_at) {
            const date = new Date(response.data.user.last_seen_at);
            return date.toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        throw new Error('API não retornou dados esperados');
    },

    async tryMobileScraping() {
        await this.randomDelay();
        
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            timeout: 20000,
            maxRedirects: 3,
            validateStatus: (status) => status < 500,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        if (response.status === 403) {
            throw new Error('Acesso negado - Mobile');
        }

        return this.extractLastSeenFromHTML(response.data);
    },

    async tryDesktopScraping() {
        await this.randomDelay();
        
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy/summary', {
            headers: {
                'User-Agent': this.getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Cache-Control': 'max-age=0',
                'Referer': 'https://devforum.roblox.com/',
            },
            timeout: 25000,
            maxRedirects: 5,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                keepAlive: true
            })
        });

        if (response.status === 403) {
            throw new Error('Acesso negado - Desktop');
        }

        return this.extractLastSeenFromHTML(response.data);
    },

    async tryLegacyMethod() {
        await this.randomDelay();
        
        // Tenta uma URL diferente
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy/activity', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 30000
        });

        return this.extractLastSeenFromHTML(response.data);
    },

    async tryBackupMethod() {
        await this.randomDelay();
        
        // Método de backup usando curl-like request
        const response = await axios({
            method: 'GET',
            url: 'https://devforum.roblox.com/u/mrwindy',
            headers: {
                'User-Agent': 'curl/7.68.0',
                'Accept': '*/*',
                'Connection': 'keep-alive',
            },
            timeout: 35000,
            responseType: 'text'
        });

        return this.extractLastSeenFromHTML(response.data);
    },

    extractLastSeenFromHTML(html) {
        const $ = cheerio.load(html);

        // Lista expandida de seletores possíveis
        const selectors = [
            '.user-main .user-stats',
            '.about .user-stats',
            '[data-stat-name="last_seen_at"]',
            '.user-stat.last-seen',
            '.user-details .last-seen',
            '.user-info .last-seen',
            '.user-card .last-seen',
            '.profile-info .last-seen',
            '.user-summary .last-seen',
            '.stats .last-seen'
        ];

        // Tenta cada seletor
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                const text = element.text().trim();
                const result = this.parseLastSeenText(text);
                if (result) return result;
            }
        }

        // Busca no texto geral da página
        const bodyText = $('body').text();
        const patterns = [
            /Last seen\s*([^<>\n]+?)(?:\n|$)/i,
            /Visto por último\s*([^<>\n]+?)(?:\n|$)/i,
            /last activity\s*([^<>\n]+?)(?:\n|$)/i,
            /última atividade\s*([^<>\n]+?)(?:\n|$)/i
        ];

        for (const pattern of patterns) {
            const match = bodyText.match(pattern);
            if (match) {
                const result = this.parseLastSeenText(match[1]);
                if (result) return result;
            }
        }

        // Busca por datas em formato comum
        const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2})/g;
        const dates = bodyText.match(datePattern);
        
        if (dates && dates.length > 0) {
            // Retorna a data mais recente encontrada
            return dates[dates.length - 1];
        }

        throw new Error('Não foi possível extrair informações da página');
    },

    parseLastSeenText(text) {
        if (!text || text.length < 3) return null;
        
        // Remove caracteres especiais e limpa o texto
        const cleaned = text
            .replace(/[\n\r\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Verifica se contém informação de data válida
        const datePatterns = [
            /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
            /\b\d{1,2}\s+\w+\s+\d{4}\b/,
            /\b\w+\s+\d{1,2},?\s+\d{4}\b/,
            /\b\d{4}-\d{2}-\d{2}\b/,
            /\b(hoje|ontem|yesterday|today)\b/i,
            /\b\d+\s+(hora?|dia?|semana?|mês|meses|ano?)s?\s+(atrás|ago)\b/i
        ];

        for (const pattern of datePatterns) {
            if (pattern.test(cleaned)) {
                return cleaned;
            }
        }

        return null;
    }
};