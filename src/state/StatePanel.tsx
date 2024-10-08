import React from 'react';
import { useMachine } from '@xstate/react';
import {
	machine,
	type MachineEvent,
} from './machine';

export function StatePanel () {
	const [ snapshot, send ] = useMachine(
		machine,
		{
			input: { myVariable: 7 }
		}
	);

	React.useEffect(
		() => {
			const event: MachineEvent = { type: 'load.config', config: { x: 9, y: 7, z: 4 }};

			send(event);
		},
		[send]
	);

	const { context, value } = snapshot;
	const { count, myVariable } = context;

	const handleGoToFileClick = () => {
		const event: MachineEvent = { type: 'goto.file' };

		send(event);
	};

	return (
		<div>
			<h2>State Panel</h2>
			<h3>{ count } { myVariable }</h3>
			<pre><code>{ JSON.stringify(value) }</code></pre>

			<button type="button" onClick={handleGoToFileClick}>goto file</button>
			<pre>
				{ JSON.stringify(snapshot) }
			</pre>
		</div>
	);
}
