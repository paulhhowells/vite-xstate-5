import { setup, fromPromise, assign } from 'xstate';

export const machine =
	setup(
		{
			types: {
				context: {} as {
					response: null;
					count: number;
				},
				events: {} as { type: 'goToSecond' }
			},
			actors: {
				ValidationActor: fromPromise(
					async ({ input }: { input: { count: number } }) => {
						console.log('INPUT', input);

						return { count: input.count + 1 };
					}
				)
			}
		}
	)
	.createMachine(
		{
			context: {
				response: null,
				count: 0
			},
			id: 'stateMachine',
			initial: 'first state',
			states: {
				'first state': {
					on: {
						goToSecond: {
							target: 'second state'
						}
					},
					description:
						'The initial state where the machine starts. It can transition to the second state.'
				},
				'second state': {
					invoke: {
						id: 'actorService',
						input: ({ context }) => ({
							count: context.count,
							testKey: 123,
							propertyKey: 2
						}),
						onDone: {
							target: 'done',
							actions: assign(({ event }) => {
								console.log('assign', event);

								return {
									count: event.output.count
									// response: event.output
								};
							})
						},
						onError: {
							target: 'error'
						},
						src: 'ValidationActor'
					},
					description:
						'In this state, the machine sends context to an actor and assigns the response from the actor to context.'
				},
				done: {
					type: 'final',
					description:
						'The state where the machine goes after receiving a response from the actor.'
				},
				error: {
					type: 'final',
					description:
						'The state where the machine goes if there is an error in the actor invocation.'
				}
			}
		}
	);
