import {
	assertEvent,
	assign,
	fromPromise,
	setup,
 } from 'xstate';
import { type EventFromLogic } from 'xstate';

type FileConfig = Record<string, string|number>;
type ValidatorActor = { input: { count: number } };

export type MachineEvent = EventFromLogic<typeof machine>;

const validationActor = fromPromise(
	async ({ input }: ValidatorActor) => {
		return { count: input.count + 1 };
	}
);
const testActor = fromPromise(async ({ input }) => {
	console.log('test src', input);

	return { output: 3 };
});

export const machine =
	setup(
		{
			types: {} as {
				input: {
					myVariable: number | string;
				},
				context: {
					config: null | FileConfig;
					count: number;
					myVariable: number | string;
				},
				events:
					| { type: 'goto.file' }
					| { type: 'load.config'; config: FileConfig }
			},
			actors: {
				validationActor,
				testActor,
			},
			actions: {},
			guards: {},
		}
	)
	.createMachine(
		{
			context: ({ input })=>({
				config: null,
				count: 0,
				myVariable: input.myVariable,
			}),
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
							target: 'process',
						},
					},
					description: 'The initial state where the machine starts. It can transition to the second state.'
				},
				'process': {
					initial: 'test',
					invoke: {
						id: 'testService',
						input: ({ context }) => ({
							count: context.count,
							myVariable: context.myVariable,
						}),
						// Inline src functions that are not created as 'actors' no longer work in Xstate 5
						src: 'testActor',
						onDone: {
							target: '#file'
						}
					},
					states: {
						'test': {}
					}
				},
				'file': {
					id: 'file',
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
							// type: 'final',
							description:
							'The state where the machine goes after receiving a response from the actor.'
						},
						'error': {
							description:
							'The state where the machine goes if there is an error in the actor invocation.'
						},
					},
				},
			},
			on: {
				'goto.file': {
					target: '.process'
				}
			},
		}
	);
