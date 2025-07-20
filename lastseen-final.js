import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { createHash, randomBytes } from 'crypto';

export default {
    data: new SlashCommandBuilder()
        .setName('lastseen')
        .setDescription('Mostra a última vez que MrWindy foi visto no DevForum'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const startTime = Date.now();
            const lastSeen = await this.getLastSeenWithMaxStealth();
            const endTime = Date.now();
            
            if (lastSeen) {
                const embed = new EmbedBuilder()
                    .setTitle('📅 Última atividade do MrWindy no DevForum')
                    .setDescription(`Última vez visto: **${lastSeen}**`)
                    .setColor(0x00AE86)
                    .setFooter({ text: `Fonte: devforum.roblox.com • Tempo: ${endTime - startTime}ms` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({
                    content: '❌ **TODAS as estratégias ultra-avançadas falharam!**\n\n' +
                            '🔒 O DevForum está com **proteção máxima** ativa.\n' +
                            '⏰ Tente novamente em **15-30 minutos**.\n' +
                            '🌐 Considere usar uma **VPN** ou **proxy**.\n' +
                            '🤖 O usuário **MrWindy** pode não existir ou ter mudado o nome.'
                });
            }

        } catch (error) {
            console.error('🚨 ERRO CRÍTICO:', error);
            await interaction.editReply('💥 Sistema completamente bloqueado. Aguarde 1 hora.');
        }
    },

    async getLastSeenWithMaxStealth() {
        const ultraStrategies = [
            { name: '🎯 JSON Stealth Pro', weight: 10, method: () => this.tryJSONStealthPro() },
            { name: '🕸️ Spider Crawl', weight: 9, method: () => this.trySpiderCrawl() },
            { name: '🎭 Identity Rotation', weight: 8, method: () => this.tryIdentityRotation() },
            { name: '🔄 Session Hijack', weight: 7, method: () => this.trySessionHijack() },
            { name: '🌊 Traffic Mimicry', weight: 6, method: () => this.tryTrafficMimicry() },
            { name: '🎪 Multi-Vector', weight: 5, method: () => this.tryMultiVector() },
            { name: '🕰️ Time-Delayed', weight: 4, method: () => this.tryTimeDelayed() },
            { name: '🎲 Chaos Method', weight: 3, method: () => this.tryChaosMethod() }
        ];

        // Embaralha estratégias para comportamento imprevívisvel
        this.shuffleArray(ultraStrategies);

        for (const strategy of ultraStrategies) {
            try {
                console.log(`🚀 EXECUTANDO: ${strategy.name} [Peso: ${strategy.weight}]`);
                
                const result = await Promise.race([
                    strategy.method(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
                ]);
                
                if (result) {
                    console.log(`🎉 ✅ ÊXITO TOTAL com ${strategy.name}!`);
                    return result;
                }
            } catch (error) {
                console.log(`💀 ${strategy.name} ELIMOINADO: ${error.message}`);
                await this.superStealthDelay(strategy.weight);
                continue;
            }
        }

        return null;
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    async superStealthDelay(weight) {
        // Delay inteligente baseado no peso da estratégia
        const baseDelay = 800 + (weight * 200);
        const jitter = Math.random() * 1500;
        const humanDelay = baseDelay + jitter;
        
        console.log(`⏳ Aguardando ${Math.round(humanDelay)}ms para próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, humanDelay));
    },

    generateFingerprint() {
        // Gera uma "impressão digital" única para cada requisição
        const timestamp = Date.now().toString();
        const randomData = randomBytes(16).toString('hex');
        return createHash('sha256').update(timestamp + randomData).digest('hex').slice(0, 16);
    },

    getUltraRealisticHeaders(type = 'chrome') {
        const fingerprint = this.generateFingerprint();
        const timestamp = Date.now();
        
        const baseHeaders = {
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8,en-US;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'X-Client-Fingerprint': fingerprint,
            'X-Request-ID': `req_${timestamp}_${Math.random().toString(36).slice(2)}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        const typeHeaders = {
            chrome: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            },
            firefox: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
            },
            safari: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
            },
            mobile: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
            }
        };

        return { ...baseHeaders, ...typeHeaders[type] };
    },

    async tryJSONStealthPro() {
        const urls = [
            'https://devforum.roblox.com/u/mrwindy.json',
            'https://devforum.roblox.com/users/mrwindy.json',
            'https://devforum.roblox.com/u/mrwindy.json?_=' + Date.now(),
            'https://devforum.roblox.com/users/mrwindy.json?include_post_count_for=1',
            'https://devforum.roblox.com/u/mrwindy/card.json',
            'https://devforum.roblox.com/u/mrwindy.json?stats=true&posts=true'
        ];

        for (const url of urls) {
            try {
                console.log(`🔍 Testando URL: ${url}`);
                
                const response = await axios.get(url, {
                    headers: {
                        ...this.getUltraRealisticHeaders('chrome'),
                        'Accept': 'application/json, text/plain, */*',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://devforum.roblox.com/u/mrwindy',
                        'Origin': 'https://devforum.roblox.com'
                    },
                    timeout: 15000,
                    maxRedirects: 3,
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false,
                        secureProtocol: 'TLSv1_3_method',
                        honorCipherOrder: false,
                        sessionIdContext: this.generateFingerprint()
                    }),
                    validateStatus: (status) => status < 500
                });

                console.log(`📊 Status: ${response.status}, Tamanho: ${JSON.stringify(response.data).length}`);

                if (response.status === 403) {
                    console.log('🚫 403 detectado, tentando próxima URL...');
                    continue;
                }

                if (response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR')}`;
                }

                // Verifica se é uma resposta válida mas estrutura diferente
                if (response.data && typeof response.data === 'object') {
                    console.log('📋 Estrutura encontrada:', Object.keys(response.data));
                }

            } catch (error) {
                console.log(`❌ URL ${url} falhou: ${error.message}`);
                continue;
            }
        }

        throw new Error('Todas URLs JSON falharam');
    },

    async trySpiderCrawl() {
        // Simula um web crawler legítimo
        const crawlerHeaders = {
            'User-Agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'From': 'crawler@devforumtracker.com',
            'Host': 'devforum.roblox.com'
        };

        const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
            headers: crawlerHeaders,
            timeout: 20000
        });

        if (response.data?.user?.last_seen_at) {
            const date = new Date(response.data.user.last_seen_at);
            return date.toLocaleString('pt-BR');
        }

        throw new Error('Spider crawl failed');
    },

    async tryIdentityRotation() {
        const identities = [
            { type: 'academic', agent: 'Mozilla/5.0 (compatible; research-bot/1.0; university study)' },
            { type: 'monitor', agent: 'Mozilla/5.0 (compatible; StatusMonitor/1.0; +http://status-check.com)' },
            { type: 'archive', agent: 'Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/)' },
            { type: 'social', agent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
            { type: 'discord', agent: 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)' }
        ];

        for (const identity of identities) {
            try {
                const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
                    headers: {
                        'User-Agent': identity.agent,
                        'Accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.9'
                    },
                    timeout: 12000
                });

                if (response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return date.toLocaleString('pt-BR');
                }
            } catch (error) {
                console.log(`Identidade ${identity.type} falhou`);
                continue;
            }
        }

        throw new Error('Identity rotation failed');
    },

    async trySessionHijack() {
        // Simula sessão legítima primeiro
        let sessionData = {};

        try {
            // Step 1: Homepage
            const home = await axios.get('https://devforum.roblox.com/', {
                headers: this.getUltraRealisticHeaders('chrome'),
                timeout: 15000,
                withCredentials: true
            });

            if (home.headers['set-cookie']) {
                sessionData.cookies = home.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
            }

            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

            // Step 2: User page
            const userPage = await axios.get('https://devforum.roblox.com/u/mrwindy', {
                headers: {
                    ...this.getUltraRealisticHeaders('chrome'),
                    'Referer': 'https://devforum.roblox.com/',
                    'Cookie': sessionData.cookies || ''
                },
                timeout: 15000,
                withCredentials: true
            });

            if (userPage.headers['set-cookie']) {
                const newCookies = userPage.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
                sessionData.cookies = sessionData.cookies ? `${sessionData.cookies}; ${newCookies}` : newCookies;
            }

            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

            // Step 3: JSON with full session
            const jsonResponse = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
                headers: {
                    ...this.getUltraRealisticHeaders('chrome'),
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': 'https://devforum.roblox.com/u/mrwindy',
                    'Cookie': sessionData.cookies || ''
                },
                timeout: 15000
            });

            if (jsonResponse.data?.user?.last_seen_at) {
                const date = new Date(jsonResponse.data.user.last_seen_at);
                return date.toLocaleString('pt-BR');
            }

        } catch (error) {
            throw new Error(`Session hijack failed: ${error.message}`);
        }

        throw new Error('Session method returned no data');
    },

    async tryTrafficMimicry() {
        // Simula tráfego real de usuário
        const actions = [
            () => axios.get('https://devforum.roblox.com/', { headers: this.getUltraRealisticHeaders('chrome'), timeout: 10000 }),
            () => axios.get('https://devforum.roblox.com/latest', { headers: this.getUltraRealisticHeaders('chrome'), timeout: 10000 }),
            () => axios.get('https://devforum.roblox.com/categories', { headers: this.getUltraRealisticHeaders('chrome'), timeout: 10000 })
        ];

        // Executa ações aleatórias primeiro
        for (let i = 0; i < 2; i++) {
            try {
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                await randomAction();
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            } catch (error) {
                // Ignora erros de ações de setup
            }
        }

        // Agora tenta o alvo
        const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
            headers: {
                ...this.getUltraRealisticHeaders('chrome'),
                'Accept': 'application/json, text/plain, */*',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://devforum.roblox.com/u/mrwindy'
            },
            timeout: 15000
        });

        if (response.data?.user?.last_seen_at) {
            const date = new Date(response.data.user.last_seen_at);
            return date.toLocaleString('pt-BR');
        }

        throw new Error('Traffic mimicry failed');
    },

    async tryMultiVector() {
        // Ataque multi-vetor simultâneo
        const vectors = [
            axios.get('https://devforum.roblox.com/u/mrwindy.json', { 
                headers: this.getUltraRealisticHeaders('chrome'),
                timeout: 8000 
            }),
            axios.get('https://devforum.roblox.com/users/mrwindy.json', { 
                headers: this.getUltraRealisticHeaders('firefox'),
                timeout: 8000 
            }),
            axios.get('https://devforum.roblox.com/u/mrwindy.json?_=' + Date.now(), { 
                headers: this.getUltraRealisticHeaders('safari'),
                timeout: 8000 
            })
        ];

        const results = await Promise.allSettled(vectors);
        
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.data?.user?.last_seen_at) {
                const date = new Date(result.value.data.user.last_seen_at);
                return date.toLocaleString('pt-BR');
            }
        }

        throw new Error('Multi-vector failed');
    },

    async tryTimeDelayed() {
        // Método com delays inteligentes
        const delays = [500, 1200, 800, 1500, 2000];
        
        for (const delay of delays) {
            await new Promise(resolve => setTimeout(resolve, delay));
            
            try {
                const response = await axios.get('https://devforum.roblox.com/u/mrwindy.json', {
                    headers: this.getUltraRealisticHeaders('chrome'),
                    timeout: 10000
                });

                if (response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return date.toLocaleString('pt-BR');
                }
            } catch (error) {
                console.log(`Delay ${delay}ms falhou`);
                continue;
            }
        }

        throw new Error('Time delayed method failed');
    },

    async tryChaosMethod() {
        // Método caótico - combinação aleatória de tudo
        const methods = ['chrome', 'firefox', 'safari', 'mobile'];
        const urls = [
            'https://devforum.roblox.com/u/mrwindy.json',
            'https://devforum.roblox.com/users/mrwindy.json'
        ];

        for (let attempt = 0; attempt < 5; attempt++) {
            const randomMethod = methods[Math.floor(Math.random() * methods.length)];
            const randomUrl = urls[Math.floor(Math.random() * urls.length)];
            const randomDelay = Math.random() * 3000;

            await new Promise(resolve => setTimeout(resolve, randomDelay));

            try {
                const response = await axios.get(randomUrl, {
                    headers: {
                        ...this.getUltraRealisticHeaders(randomMethod),
                        'Accept': 'application/json',
                        'X-Chaos-ID': this.generateFingerprint()
                    },
                    timeout: 12000
                });

                if (response.data?.user?.last_seen_at) {
                    const date = new Date(response.data.user.last_seen_at);
                    return date.toLocaleString('pt-BR');
                }
            } catch (error) {
                continue;
            }
        }

        throw new Error('Chaos method exhausted');
    }
};