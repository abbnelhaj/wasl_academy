import { FEDERATION_DIR_NAME } from '../constants.js';
export function sanityEnvironmentPlugin(options) {
    return {
        config () {
            return {
                builder: {
                    async buildApp (builder) {
                        await builder.build(builder.environments[FEDERATION_DIR_NAME]);
                    }
                },
                environments: {
                    [FEDERATION_DIR_NAME]: {
                        build: {
                            copyPublicDir: false,
                            outDir: `dist`,
                            rollupOptions: {
                                input: options.input
                            }
                        },
                        consumer: 'client'
                    }
                }
            };
        },
        name: 'sanity/environment'
    };
}

//# sourceMappingURL=plugin-sanity-environment.js.map