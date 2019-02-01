const cluster = require('cluster');

module.exports = class ClusterManager {
    /**
     * Creates a new instance of an Cluster manager
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {{ [x: string]: number | string; }[]} */
        this.shard = [];
    }

    async spawn() {
        if (cluster.isMaster)
            await this.spawnMaster();
        else
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
     * Spawns the workers
     */
    spawnWorkers() {
        const startup = (msg) => {
            if (msg.type !== 'startup') {
                cluster.worker.once('message', startup);
                return;
            }

            this.client.logger.info(`Received a message from master:\n${require('util').inspect(msg)}`);
        };

        cluster.worker.once('message', startup);
    }

    /**
     * Spawns master
     */
    async spawnMaster() {
        const { shards } = await this.client.getBotGateway();
        let shardsPerWorker;
        let fields = [];
        fields.push({ name: 'Total Shards', value: shards, inline: true });

        const cpus = this.getCPULimit();
        if (cpus >= shards) 
            shardsPerWorker = 1;
        else
            shardsPerWorker = Math.ceil(shards / cpus);

        fields.push({ name: 'Shards Per Worker', value: shardsPerWorker, inline: true });

        const workerCoint = Math.ceil(shards / shardsPerWorker);
        fields.push({ name: 'Workers', value: workerCoint, inline: true });
        for (let i = 0; i < workerCoint; i++) {
            let start = i * shardsPerWorker;
            let end = ((i + 1) * shardsPerWorker) - 1;
            let range = start === end? `Shard ${start}`: `Shards ${start}-end`;

            const worker = cluster.fork();
            Object.assign(worker, {
                type: 'bot',
                shardStart: start,
                shardEnd: end,
                shardRange: range,
                shards
            });
            this.shard.push({
                start,
                end,
                range
            });
            require('./cluster/worker').start(this.client, worker);
        }

        await this.client.webhook.embed({
            description: 'Master has started.',
            fields
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