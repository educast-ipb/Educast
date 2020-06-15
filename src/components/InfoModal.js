import React, { useMemo } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FaWindowClose } from 'react-icons/fa';
import styles from './InfoModal.module.scss';

const shortcuts = [
	'Space bar: Alternar entre play/pause no vídeo',
	'Setas : Navegar frame a frame na timeline (setas para frente e para atrás)',
	'Shift + setas: Navegar segundo a segundo na timeline (setas para frente e para atrás)',
	'I: Definir o início de uma cena ou capítulo (de acordo como posicionamento do cursor)',
	'O: Definir o final de uma cena (de acordo como posicionamento do cursor)',
	'S: Adicionar uma cena',
	'C: Adicionar um capítulo',
	'A: Retroceder para cena/capítulo anterior',
	'P: Avançar para a próxima cena/capítulo',
	'Shift + A: posicionar o cursor no inicio da cena/capítulo anterior',
	'Shift + P: posicionar o cursor no inicio da cena capítulo seguinte',
	'Backspace/delete: Apagar o elemento selecionado (Capítulo ou cena)',
	'Enter: Acionar o botão de confirmação “ok”',
	'Esc: Acionar o botão de “Cancelar” ',
];

const InfoModal = ({ onToggle, isOpen }) => {
	const shortcutsNodes = useMemo(
		() =>
			shortcuts.map((text) => {
				return <div className={styles.textBox}>{text}</div>;
			}),
		[]
	);
	return (
		<div>
			<Modal
				isOpen={isOpen}
				toggle={onToggle}
				size="lg"
				contentClassName={styles.modal}
			>
				<ModalHeader
					toggle={onToggle}
					className={styles.modalHeader}
					close={
						<FaWindowClose
							size="1.3rem"
							className={styles.closeIcon}
							onClick={onToggle}
						/>
					}
				>
					Atalhos
				</ModalHeader>
				<ModalBody>{shortcutsNodes}</ModalBody>
			</Modal>
		</div>
	);
};

export default InfoModal;
