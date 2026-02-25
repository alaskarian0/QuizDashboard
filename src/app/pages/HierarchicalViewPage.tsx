import { HierarchicalView } from '@/app/components/admin/HierarchicalView';

interface HierarchicalViewPageProps {
  isDark: boolean;
}

export function HierarchicalViewPage({ isDark }: HierarchicalViewPageProps) {
  return <HierarchicalView isDark={isDark} />;
}
