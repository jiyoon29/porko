import Tab from '@/components/ui/Tab';

import Line from '../common/Line';
import BudgetBanner from '../common/BudgetBanner';
import ExpensCalendarBox from './ExpensCalendarBox';
import ExpensListBox from './ExpensListBox';

const LookAloneContainer = () => {
  return (
    <div>
      <div className='px-20 pb-24 pt-16'>
        <Tab array={['캘린더 보기', '내역 보기']} type='box' tabKey='displayMode' />
      </div>
      <div className='px-20 text-12'>
        <BudgetBanner />
        <ExpensCalendarBox />
      </div>
      <Line />
      <ExpensListBox />
    </div>
  );
};

export default LookAloneContainer;
