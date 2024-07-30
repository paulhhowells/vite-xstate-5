import { useMachine } from '@xstate/react';
import { machine } from './machine';


export function StatePanel () {
	const [snapshot, send] = useMachine(machine);

	console.log('snapshot', snapshot);
	console.log('send', send);

	const handleUpdateClick = () => {
		send({ type: 'goToSecond' });
	};

	return (
		<div>
			<h1>State Panel</h1>
			<button type="button" onClick={handleUpdateClick}>goToSecond</button>
		</div>
	);
}
