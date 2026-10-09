import { PrimaryButton } from '@/components/ui/primary-button';

type NextButtonProps = {
  isLast: boolean;
  onPress: () => void;
};

/** 作答後出現的「下一題」；最後一題改成「查看調查報告」 */
export function NextButton({ isLast, onPress }: NextButtonProps) {
  return <PrimaryButton label={isLast ? '查看調查報告' : '下一題'} onPress={onPress} />;
}
