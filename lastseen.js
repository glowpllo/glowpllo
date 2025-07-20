import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default {
    data: new SlashCommandBuilder()
        .setName('lastseen')
        .setDescription('Mostra a última vez que MrWindy foi visto no DevForum'),

    async execute(interaction) {
        try {
            // Primeiramente, vamos tentar acessar a API do Discourse (se disponível)
            const lastSeen = await this.getLastSeenFromForum();
            
            if (lastSeen) {
                const embed = new EmbedBuilder()
                    .setTitle('📅 Última atividade do MrWindy no DevForum')
                    .setDescription(`Última vez visto: **${lastSeen}**`)
                    .setColor(0x00AE86)
                    .setFooter({ text: 'Fonte: devforum.roblox.com' });

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('❌ Não foi possível obter as informações do DevForum no momento. Tente novamente em alguns minutos.');
            }

        } catch (error) {
            console.error('Erro ao buscar dados do DevForum:', error);
            await interaction.reply('❌ Ocorreu um erro ao buscar as informações no DevForum.');
        }
    },

    async getLastSeenFromForum() {
        const attempts = [
            // Tentativa 1: API do Discourse
            async () => await this.tryDiscourseAPI(),
            // Tentativa 2: Scraping com headers avançados
            async () => await this.tryAdvancedScraping(),
            // Tentativa 3: Método alternativo
            async () => await this.tryAlternativeMethod()
        ];

        for (const attempt of attempts) {
            try {
                const result = await attempt();
                if (result) return result;
            } catch (error) {
                console.log('Tentativa falhou, tentando próxima...', error.message);
                continue;
            }
        }

        return null;
    },

    async tryDiscourseAPI() {
        try {
            // Tenta acessar a API do Discourse diretamente
            const response = await axios.get('https://devforum.roblox.com/users/mrwindy.json', {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                timeout: 10000
            });

            if (response.data && response.data.user) {
                const lastSeenAt = response.data.user.last_seen_at;
                if (lastSeenAt) {
                    return new Date(lastSeenAt).toLocaleString('pt-BR');
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async tryAdvancedScraping() {
        try {
            const response = await axios.get('https://devforum.roblox.com/u/mrwindy/summary', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    'Referer': 'https://devforum.roblox.com/',
                },
                timeout: 15000,
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status < 500; // Resolve apenas se não for erro 5xx
                }
            });

            if (response.status === 403) {
                throw new Error('Acesso negado (403)');
            }

            const $ = cheerio.load(response.data);

            // Múltiplos seletores para tentar encontrar a informação
            const selectors = [
                '.user-main .user-stats',
                '.about .user-stats', 
                '[data-stat-name="last_seen_at"]',
                '.user-stat.last-seen',
                '.user-details .last-seen'
            ];

            for (const selector of selectors) {
                const element = $(selector);
                if (element.length > 0) {
                    const text = element.text().trim();
                    const match = text.match(/Last seen\s*([\w\s,:\-]+)/i) || 
                                 text.match(/Visto por último\s*([\w\s,:\-]+)/i);
                    
                    if (match) {
                        return match[1].trim();
                    }
                }
            }

            // Se não encontrou com seletores específicos, procura no texto geral
            const pageText = $('body').text();
            const lastSeenMatch = pageText.match(/Last seen\s*([\w\s,:\-]+)/i);
            
            if (lastSeenMatch) {
                return lastSeenMatch[1].trim();
            }

            return null;
        } catch (error) {
            throw error;
        }
    },

    async tryAlternativeMethod() {
        try {
            // Delay para simular comportamento humano
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const response = await axios.get('https://devforum.roblox.com/u/mrwindy', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                timeout: 20000
            });

            const $ = cheerio.load(response.data);
            
            // Busca mais ampla na página
            const possibleElements = $('.user-detail, .about, .stats, [class*="last"], [class*="seen"]');
            
            for (let i = 0; i < possibleElements.length; i++) {
                const text = $(possibleElements[i]).text();
                if (text.toLowerCase().includes('last seen') || text.toLowerCase().includes('seen')) {
                    const match = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4})/);
                    if (match) {
                        return match[1];
                    }
                }
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
};