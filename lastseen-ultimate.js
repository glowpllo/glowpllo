import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export default {
    data: new SlashCommandBuilder()
        .setName('lastseen')
        .setDescription('Mostra a última vez que MrWindy foi visto no DevForum'),

    async execute(interaction) {
        await interaction.deferReply();

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
                await interaction.editReply('❌ Todas as estratégias falharam. O DevForum pode estar com proteção máxima ativa ou o usuário não existe.');
            }

        } catch (error) {
            console.error('Erro geral:', error);
            await interaction.editReply('❌ Erro crítico no sistema.');
        }
    },

    async getLastSeenFromForum() {
        const strategies = [
            { name: 'JSON Direct', method: () => this.tryDirectJSON() },
            { name: 'JSON Alternative', method: () => this.tryJSONAlternative() },
            { name: 'API com Session', method: () => this.tryAPIWithSession() },
            { name: 'Proxy Method', method: () => this.tryProxyMethod() },
            { name: 'Bot Simulator', method: () => this.tryBotSimulator() },
            { name: 'Gradual Loading', method: () => this.tryGradualLoading() },
            { name: 'Search Method', method: () => this.trySearchMethod() },
            { name: 'RSS Feed', method: () => this.tryRSSFeed() }
        ];

        for (const strategy of strategies) {
            try {
                console.log(`🔄 Tentando estratégia: ${strategy.name}`);
                const result = await strategy.method();
                if (result) {
                    console.log(`✅ SUCESSO com estratégia: ${strategy.name}`);
                    return result;
                }
            } catch (error) {
                console.log(`❌ Falha na estratégia ${strategy.name}: ${error.message}`);
                await this.smartDelay(strategy.name);
                continue;
            }
        }

        return null;
    },

    async smartDelay(strategyName) {
        // Delays específicos baseados no tipo de falha
        const baseDelay = 1500;
        const randomFactor = Math.random() * 2000;
        const strategyMultiplier = strategyName.includes('JSON') ? 0.5 : 1;
        
        const delay = (baseDelay + randomFactor) * strategyMultiplier;
        await new Promise(resolve => setTimeout(resolve, delay));
    },

    getAdvancedUserAgent() {
        const agents = [
            // Chrome mais recente
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            // Firefox mais recente
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
            // Safari
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            // Edge
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
            // Mobile
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 14; Mobile; rv:122.0) Gecko/122.0 Firefox/122.0'
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    },

    getRandomIP() {
        // Simula diferentes IPs para X-Forwarded-For
        const ips = [
            '203.0.113.' + Math.floor(Math.random() * 255),
            '198.51.100.' + Math.floor(Math.random() * 255),
            '192.0.2.' + Math.floor(Math.random() * 255)
        ];
        return ips[Math.floor(Math.random() * ips.length)];
    },

    async tryDirectJSON() {
        // Tenta sua sugestão diretamente
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': this.getAdvancedUserAgent(),
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Forwarded-For': this.getRandomIP(),
                'Referer': 'https://devforum.roblox.com/u/mrwindy',
                'Origin': 'https://devforum.roblox.com',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            timeout: 10000,
            validateStatus: (status) => status < 500,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                secureProtocol: 'TLSv1_3_method',
                keepAlive: true
            })
        });

        if (response.status === 403) {
            throw new Error('403 Forbidden');
        }

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

        throw new Error('Dados não encontrados no JSON');
    },

    async tryJSONAlternative() {
        // Variação da URL JSON
        const urls = [
            'https://devforum.roblox.com/users/mrwindy.json',
            'https://devforum.roblox.com/u/mrwindy.json?include_post_count_for=1',
            'https://devforum.roblox.com/users/mrwindy.json?stats=true',
            'https://devforum.roblox.com/u/mrwindy/card.json'
        ];

        for (const url of urls) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': this.getAdvancedUserAgent(),
                        'Accept-Language': 'en-US,en;q=0.9',
                        'X-Forwarded-For': this.getRandomIP(),
                        'Referer': 'https://devforum.roblox.com/',
                        'Origin': 'https://devforum.roblox.com'
                    },
                    timeout: 8000,
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                });

                if (response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return date.toLocaleString('pt-BR');
                }
            } catch (error) {
                console.log(`URL ${url} falhou:`, error.message);
                continue;
            }
        }

        throw new Error('Todas URLs JSON falharam');
    },

    async tryAPIWithSession() {
        // Simula uma sessão primeiro
        try {
            // Primeiro, faz uma requisição à página principal para pegar cookies
            const mainPage = await axios.get('https://devforum.roblox.com/', {
                headers: {
                    'User-Agent': this.getAdvancedUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: 15000,
                withCredentials: true
            });

            // Extrai cookies se houver
            const cookies = mainPage.headers['set-cookie'] || [];
            const cookieString = cookies.map(cookie => cookie.split(';')[0]).join('; ');

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Agora tenta a requisição JSON com os cookies
            const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': this.getAdvancedUserAgent(),
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://devforum.roblox.com/u/mrwindy',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': cookieString,
                    'X-Forwarded-For': this.getRandomIP()
                },
                timeout: 12000
            });

            if (response.data?.user?.last_seen_at) {
                const date = new Date(response.data.user.last_seen_at);
                return date.toLocaleString('pt-BR');
            }

        } catch (error) {
            throw new Error('Falha na simulação de sessão');
        }

        throw new Error('Sessão não retornou dados');
    },

    async tryProxyMethod() {
        // Simula requisição através de proxy
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'X-Real-IP': this.getRandomIP(),
                'X-Forwarded-For': this.getRandomIP(),
                'X-Forwarded-Proto': 'https',
                'Via': '1.1 proxy.example.com',
                'Referer': 'https://www.google.com/'
            },
            timeout: 15000
        });

        if (response.data?.user?.last_seen_at) {
            const date = new Date(response.data.user.last_seen_at);
            return date.toLocaleString('pt-BR');
        }

        throw new Error('Proxy method failed');
    },

    async tryBotSimulator() {
        // Simula comportamento de bot legítimo
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
            headers: {
                'User-Agent': 'DiscordBot (https://discord.com, 2.0)',
                'Accept': 'application/json',
                'From': 'bot@example.com',
                'X-Bot-Name': 'DevForumTracker',
                'X-Forwarded-For': this.getRandomIP()
            },
            timeout: 10000
        });

        if (response.data?.user?.last_seen_at) {
            const date = new Date(response.data.user.last_seen_at);
            return date.toLocaleString('pt-BR');
        }

        throw new Error('Bot simulator failed');
    },

    async tryGradualLoading() {
        // Carrega gradualmente como um usuário real
        const steps = [
            'https://devforum.roblox.com/',
            'https://devforum.roblox.com/u/mrwindy',
            'https://devforum.roblox.com/u/mrwindy.json'
        ];

        const userAgent = this.getAdvancedUserAgent();
        let cookies = '';

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const isLast = i === steps.length - 1;
            
            try {
                const response = await axios.get(step, {
                    headers: {
                        'User-Agent': userAgent,
                        'Accept': isLast ? 'application/json' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Cookie': cookies,
                        'Referer': i > 0 ? steps[i-1] : undefined,
                        'X-Forwarded-For': this.getRandomIP()
                    },
                    timeout: 15000,
                    withCredentials: true
                });

                // Coleta cookies para próxima requisição
                if (response.headers['set-cookie']) {
                    const newCookies = response.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
                    cookies = cookies ? `${cookies}; ${newCookies}` : newCookies;
                }

                if (isLast && response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return date.toLocaleString('pt-BR');
                }

                // Delay entre steps para simular navegação humana
                if (!isLast) {
                    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
                }

            } catch (error) {
                console.log(`Step ${step} falhou:`, error.message);
                if (isLast) throw error;
            }
        }

        throw new Error('Gradual loading failed');
    },

    async trySearchMethod() {
        // Tenta através da busca do DevForum
        const response = await axios.get('https://devforum.roblox.com/search.json?q=mrwindy', {
            headers: {
                'User-Agent': this.getAdvancedUserAgent(),
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://devforum.roblox.com/search?q=mrwindy',
                'X-Forwarded-For': this.getRandomIP()
            },
            timeout: 12000
        });

        if (response.data?.users) {
            const user = response.data.users.find(u => 
                u.username.toLowerCase() === 'mrwindy' || 
                u.name?.toLowerCase() === 'mrwindy'
            );
            
            if (user?.last_seen_at) {
                const date = new Date(user.last_seen_at);
                return date.toLocaleString('pt-BR');
            }
        }

        throw new Error('Search method failed');
    },

    async tryRSSFeed() {
        // Tenta através do feed RSS/Atom
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy/activity.rss', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
                'Accept': 'application/rss+xml, application/xml, text/xml',
                'X-Forwarded-For': this.getRandomIP()
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data, { xmlMode: true });
        const items = $('item');
        
        if (items.length > 0) {
            const latestDate = $(items[0]).find('pubDate').text();
            if (latestDate) {
                const date = new Date(latestDate);
                return date.toLocaleString('pt-BR');
            }
        }

        throw new Error('RSS feed method failed');
    }
};