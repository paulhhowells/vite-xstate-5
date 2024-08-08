import React from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './machine';

export function StatePanel () {
	const [ snapshot, send ] = useMachine(
		machine,
		{
			input: { myVariable: 7 }
		}
	);

	React.useEffect(
		() => {
			send({ type: 'load.config', config: { x: 9, y: 7, z: 4 }});
		},
		[send]
	);

	const { context, value } = snapshot;
	const { count, myVariable } = context;

	const handleGoToFileClick = () => {
		send({ type: 'goto.file' });
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
