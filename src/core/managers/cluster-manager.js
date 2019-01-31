const { Collection } = require('eris');
const cluster        = require('cluster');

module.exports = class ClusterManager {
    /**
     * Creates a new instance of an Cluster manager
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<cluster.Worker>} */
        this.workers = new Collection();
    }

    async spawn() {
        this.client.logger.info('Spawning clusters...');
        await this.spawnWorkers();
    }

    /**
     * Gets the cpu core limit
     * @returns {number} the lewdest boi
     */
    getCPULimit() {
        const cpu = this.client.getCPU();
        return cpu.avaliable;
    }

    /**
     * Spawns the cluster system
     */
    async spawnWorkers() {
        this.client.logger.info('Now setting up clusters...');
        cluster.setupMaster({ slient: false });

        const limit = this.getCPULimit();
        for (let i = 0; i < limit.length; i++) {
            cluster.fork();
        }

        cluster
            .on('online', (clu) => {
                this.client.logger.info(`Worker #${clu.id} is now online.`);
                this.workers.add(clu);
                this.client.createMessage(process.env.LOG_CHANNEL, {
                    embed: {
                        description: `Worker #${clu.id} has started`,
                        color: this.client.color,
                        footer: { 
                            text: (() => {
                                const i = this.getOnlineWorkers();
                                return `${i} worker${i > 1? 's': ''} online.`
                            })() 
                        }
                    }
                });
            })
            .on('exit', (clu, code, signal) => {
                this.workers.remove(clu);
                this.client.logger.warn(`Worker #${clu.id} was killed; code ${code}. (${signal? signal: 'No signal.'})`);
                this.client.createMessage(process.env.LOG_CHANNEL, {
                    embed: {
                        description: `Worker #${clu.id} has died`,
                        color: this.client.color,
                        footer: { 
                            text: (() => {
                                const i = this.getOnlineWorkers();
                                return `${i} worker${i > 1? 's': ''} online.`
                            })() 
                        }
                    }
                });
            });
    }

    /**
     * Gathers the online cluster workers
     * @returns {cluster.Worker[]} An array of the workers online
     */
    getOnlineWorkers() {
        return Object
            .keys(cluster.workers)
            .map(id => cluster.workers[id])
            .filter(w => w.isConnected());
    }
}