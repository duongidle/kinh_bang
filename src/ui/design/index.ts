// Lớp design: token, phông và thành phần. Chỉ nạp kiểu từ đây (U1 chưa nạp vào app).
import './tokens.css';
import './fonts.css';
import './components.css';

export { Button, type ButtonProps } from './components/Button';
export { SegmentedControl, type SegmentedControlProps } from './components/SegmentedControl';
export { NumberInput, type NumberInputProps } from './components/NumberInput';
export { Slider, type SliderProps } from './components/Slider';
export { StatTile, type StatTileProps } from './components/StatTile';
export { Card } from './components/Card';
export { DataTable, type DataColumn } from './components/DataTable';
export { TAccount, type TAccountLine } from './components/TAccount';
export { StatusBadge, type BadgeTone } from './components/StatusBadge';
export { WarningBanner } from './components/WarningBanner';
export { Dialog, type DialogProps } from './components/Dialog';
export { SidePanel, type SidePanelProps } from './components/SidePanel';
export { Tabs, type TabsProps } from './components/Tabs';
export { Tooltip, type TooltipProps } from './components/Tooltip';
export { GlossaryTerm } from './components/GlossaryTerm';
export { SourceTag, type SourceTagProps } from './components/SourceTag';
