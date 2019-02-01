const crashes = {};
const cluster = require('cluster');

module.exports = {
    /**
     * Starts the bot worker
     * @param {import('../../internal/client')} client The client
     * @param {import('cluster').Worker} worker The worker
     */
    start: (client, worker) => {
        worker.on('online', () => {
            worker.send({
                type: 'startup',
                shardRange: worker.shardRange,
                shardStart: worker.shardStart,
                shardEnd: worker.shardEnd,
                shards: worker.shards,
                processType: 'bot'
            });
            client.logger.info(`Worker ${worker.id} has started.`);
            client.webhook.send(`${client.emojis.INFO} **|** Worker \`#${worker.id}\` has started.`);
        });

        worker.on('exit', (code, signal) => {
            if (signal)
                return;

            if (code === 0) {
                client.logger.warn(`Worker #${worker.id} has died successfully. Hosting ${worker.shardStart} to ${worker.shardEnd}.`);
                client.webhook.send(`${client.emojis.WARN} **|** Worker \`#${worker.id}\` died successfully. Hosted ${worker.shardStart} to ${worker.shardEnd}`);
            } else if (crashes[worker.shardRange] >= 2) {
                client.logger.error(`Worker ${worker.id} died due to restart loop with exit code ${code}. Hosted ${worker.shardRange}`);
                client.webhook.send(`${client.emojis.WARN} **|** Worker \`#${worker.id}\` died due to restart loop.\nExit Code: ${code}\nHosted ${worker.shardRange}`);
            } else {
                client.logger.warn(`Worker #${worker.id} died with exit code ${code}; hosted ${worker.shardRange}. Respawning as an new proces...`);
                const newWorker = cluster.fork();
                Object.assign(newWorker, {
                    type: 'bot',
                    shardStart: worker.shardStart,
                    shardEnd: worker.shardEnd,
                    shardRange: worker.shardRange,
                    shards: worker.shards
                });
                module.exports.start(client, worker);

                client.webhook.send(`${client.emojis.INFO} **|** Worker \`#${worker.id}\` died.\nExit Code: ${code}\nHosted ${worker.shardRange}\nRespawned as ${newWorker.id}!`);
                if (!crashes[worker.shardRange])
                    crashes[worker.shardRange] = 1;
                else
                    crashes[worker.shardRange]++;

                setTimeout(() => {
                    if (crashes[worker.shardRange] === 1)
                        delete crashes[worker.shardRange];
                    else
                        crashes[worker.shardRange]--;
                }, 120000);
            }
        });
    }
};