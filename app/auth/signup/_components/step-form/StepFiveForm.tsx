import { ChangeEvent, useState, useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import Text from '@/components/ui/Text';
import CheckIcon from '@/components/icons/CheckIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';

const policyList = [
  {
    id: 'service',
    title: '[필수] (프로덕트명) 서비스 필수 동의'
  },
  {
    id: 'IdentityVerification',
    title: '[필수] 본인확인 필수 동의'
  },
  {
    id: 'CreditManagementService',
    title: '[필수] 신용관리 서비스 필수 동의'
  }
];
type CheckboxType = {
  selectAll: boolean;
  selectOptions: boolean[];
};
export const StepFiveForm = () => {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<CheckboxType>();
  const selectedOptionsArray = policyList.map((_, index) => watch(`selectOptions.${index}`));
  const isSelectedOption = selectedOptionsArray.every((select) => select === true);
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      policyList.forEach((_, index) => {
        setValue(`selectOptions.${index}`, true);
      });
    } else {
      policyList.forEach((_, index) => {
        setValue(`selectOptions.${index}`, false);
      });
    }
  };

  useEffect(() => {
    setIsAllChecked(isSelectedOption);
  }, [isSelectedOption]);

  const handleOnSubmit: SubmitHandler<CheckboxType> = (data) => {
    // console.log('selectOptions: ', data.selectOptions);
    // console.log('isSelect 0: ', data.selectOptions[0]);
    // console.log('isSelect 1: ', data.selectOptions[1]);
    // console.log('isSelect 2: ', data.selectOptions[2]);
  };
  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <CardContent flexDirection='col' className='w-full'>
        <Text sizes='20'>이용약관을 확인하고 동의해주세요</Text>
        <label className='has-[:checked]:text-green-500 has-[:checked]:ring-indigo-200'>
          <CardContent alignItems='center' className='gap-x-4 p-0'>
            <input
              {...register('selectAll')}
              checked={isAllChecked}
              onChange={handleSelectAll}
              type='checkbox'
              className='hidden '
            />
            <CheckIcon
              fill={isAllChecked ? '#51D868' : '#fff'}
              stroke={isAllChecked ? '#fff' : '#b7b7b7'}
            />
            <Text sizes='18'>필수 항목 모두 동의하기</Text>
          </CardContent>
        </label>
        <CardContent
          flexDirection='col'
          className='w-full rounded-2xl border border-black px-0 py-0 [&>*]:border-b [&>*]:border-black'
        >
          {policyList.map((item, index) => {
            const isChecked = selectedOptionsArray[index] === true;
            const fillClass = isChecked ? 'fill-[#51D868]' : 'fill-white';
            const strokeClass = isChecked ? 'stroke-white' : 'stroke-[#b7b7b7]';
            return (
              <div
                key={item.id}
                className='flex w-full items-center justify-between p-5 last:border-b-0'
              >
                <label className='flex cursor-pointer items-center justify-between has-[:checked]:text-green-500 has-[:checked]:ring-indigo-200'>
                  <CardContent alignItems='center' className='gap-x-4 p-0'>
                    <input
                      {...register(`selectOptions.${index}`)}
                      type='checkbox'
                      className='hidden'
                      id={item.id}
                    />
                    <CheckIcon className={`${fillClass} ${strokeClass}`} />
                    <Text sizes='18'>{item.title}</Text>
                  </CardContent>
                </label>
                <ArrowRightIcon className='fill-none stroke-black' width={8} height={12} />
              </div>
            );
          })}
        </CardContent>
        <CardContent
          alignItems='center'
          justifyContent='between'
          className='w-full rounded-2xl border border-black p-5'
        >
          <label className='flex cursor-pointer items-center justify-between has-[:checked]:text-green-500 has-[:checked]:ring-indigo-200'>
            <CardContent alignItems='center' className='gap-x-4 p-0'>
              <input type='checkbox' className='peer/promotion hidden' id='promotion' />
              <CheckIcon className='fill-white stroke-[#b7b7b7] peer-checked/promotion:fill-[#51D868] peer-checked/promotion:stroke-white' />
              <Text sizes='18'>[선택] 프로모션 알림 수신 동의</Text>
            </CardContent>
          </label>
          <ArrowRightIcon className='fill-none stroke-black' width={8} height={12} />
        </CardContent>
        <CardFooter>
          <Button className='h-20 text-white'>이전</Button>
          <Button
            disabled={!isAllChecked}
            type='submit'
            className='h-20 text-white disabled:bg-gray-300'
          >
            완료
          </Button>
        </CardFooter>
      </CardContent>
    </form>
  );
};
