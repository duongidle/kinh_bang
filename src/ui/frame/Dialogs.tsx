// Hộp thoại của khung chơi: ghi chú mô hình, lưu/tải/xuất, mọi sự kiện.
import { Dialog } from '../design';
import { useStore } from '../store';
import { Files } from '../views/Files';
import { Notes } from '../views/Notes';
import { EventList } from './EventList';

export function Dialogs() {
  const dialog = useStore((s) => s.dialog);
  const openDialog = useStore((s) => s.openDialog);
  const events = useStore((s) => s.events);
  if (!dialog) return null;
  const close = () => openDialog(null);
  if (dialog.kind === 'notes')
    return (
      <Dialog open title="Mô hình này bỏ qua gì" onClose={close}>
        <Notes focus={dialog.id} />
      </Dialog>
    );
  if (dialog.kind === 'file')
    return (
      <Dialog open title="Lưu, tải, xuất" onClose={close}>
        <Files />
      </Dialog>
    );
  return (
    <Dialog open title="Mọi sự kiện" onClose={close}>
      {events.length === 0 ? <p className="hint">Chưa có sự kiện.</p> : <EventList events={[...events].reverse()} onDone={close} />}
    </Dialog>
  );
}
