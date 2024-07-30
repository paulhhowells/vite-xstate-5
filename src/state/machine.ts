import { setup, fromPromise, assign } from 'xstate';

type FileConfig = Record<string, string|number>;
type ValidatorActor = { input: { count: number } };

const validationActor = fromPromise(
	async ({ input }: ValidatorActor) => {
		return { count: input.count + 1 };
	}
);

export const machine =
	setup(
		{
			types: {
				context: {} as {
					config: null | FileConfig;
					count: number;
				},
				events: {} as
					| { type: 'goto.file' }
					| { type: 'load.config'; config: FileConfig }
			},
			actors: {
				validationActor,
			},
			actions: {},
			guards: {},
		}
	)
	.createMachine(
		{
			context: {
				config: null,
				count: 0,
			},
			id: 'machine',
			initial: 'unready',
			states: {
				'unready': {
					on: {
						'load.config': {
							actions: assign(
								({ event: { config } }) => ({ config })
							),
							guard: ({ event: { config } }) => (config && 'x' in config),
							target: 'file',
						},
					},
					description: 'The initial state where the machine starts. It can transition to the second state.'
				},
				'file': {
					initial: 'validate',
					states: {
						'validate': {
							invoke: {
								id: 'actorService',
								src: 'validationActor',
								input: ({ context }) => ({
									count: context.count
								}),
								onDone: {
									target: 'done',
									actions: assign(({ event }) => {
										return { count: event.output.count };
									})
								},
								onError: {
									target: 'error'
								}
							},
							description: 'In this state, the machine sends context to an actor and assigns the response from the actor to context.'
						},
						'done': {
							type: 'final',
							description:
							'The state where the machine goes after receiving a response from the actor.'
						},
						'error': {
							type: 'final',
							description:
							'The state where the machine goes if there is an error in the actor invocation.'
						},
					},
				},
			},
			on: {
				'goto.file': {
					target: '.file'
				}
			},
		}
	);
