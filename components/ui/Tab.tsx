import { usePathname, useSearchParams } from 'next/navigation';
import FlexBox from './FlexBox';
import Text from './Text';
import Link from 'next/link';
import { useCallback } from 'react';

type TabProps = {
  array: string[];
  type: 'box' | 'underline';
  tabKey: string;
};

const Tab = ({ array, type, tabKey }: TabProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(tabKey);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <FlexBox
      className={`${type === 'box' ? 'gap-[0.8rem]' : '-mb-px w-full border-b border-gray-200 px-[2rem]'}`}
    >
      {array.map((label) => {
        return (
          <Link
            scroll={false}
            href={pathname + '?' + createQueryString(tabKey, label)}
            key={label}
            className={getStyle(type, label === selectedTab)}
          >
            <Text weight={type === 'box' ? '500' : '700'}>{label}</Text>
          </Link>
        );
      })}
    </FlexBox>
  );
};

const getStyle = (type: 'box' | 'underline', isSelcted: boolean) => {
  let className = 'inline-block';

  if (type === 'box') {
    className += ' rounded-[4.3rem] px-[1.4rem] py-[0.7rem]';
    if (isSelcted) {
      className += ' bg-black text-white';
    } else {
      className += ' h-[3.4rem] border border-gray-400';
    }
  }

  if (type === 'underline') {
    className += ' w-full text-center px-[1rem] py-[1.2rem] -mb-px';
    if (isSelcted) {
      className += ' h-[4.4rem] border-b-2 border-black';
    } else {
      className += ' text-gray-400';
    }
  }

  return className;
};

export default Tab;