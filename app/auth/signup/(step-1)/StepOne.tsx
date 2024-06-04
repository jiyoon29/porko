/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import FlexBox from '@/components/ui/FlexBox';
import Button from '@/components/ui/Button';
import Spinner from '@/components/Spinner';
import AuthHeader from '../../_components/AuthHeader';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CardContent } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { checkEmailDuplicate } from '@/service/api/auth';
import { SignupInputsValues } from '../../schema/signupSchema';
import { useSignupStore } from '@/store/signup';
const ClearInputValueIcon = dynamic(() => import('../../_components/ClearInputValueIcon'), {
  ssr: false
});
const EyeIcon = dynamic(() => import('../../_components/EyeIcon'), { ssr: false });

const StepOne = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    setValue,
    getValues,
    control,
    trigger,
    formState: { errors },
    setError,
    clearErrors
  } = useFormContext<SignupInputsValues>();

  const { setStorage } = useSignupStore();

  type Tdata = {
    userId: string;
    message: string;
  };

  const { mutate, isPending } = useMutation<Tdata, Error, string>({
    mutationFn: (id) => checkEmailDuplicate(id),
    onSuccess: (data) => {
      if (data) {
        setError('email', {
          type: 'manual',
          message: data.message || ''
        });
        setValue('checkEmail', true);
      }
    },
    onError: (err) => {
      setError('email', {
        type: 'manual',
        message: err.message || ''
      });
    }
  });

  const email = useWatch({
    control,
    name: 'email'
  });

  const validateEmail = useCallback(async () => {
    const isValidEmail = await trigger('email');
    if (!isValidEmail) {
      setError('email', {
        type: 'manual',
        message: errors.email?.message || ''
      });
    } else {
      clearErrors('email');
      setValue('checkEmail', false);
    }
  }, [trigger, setError, clearErrors, errors.email, setValue]);

  useEffect(() => {
    validateEmail();
  }, [email]);

  const onClickNext = async () => {
    const isEmailValid = await trigger('email', { shouldFocus: true });
    const isPasswordValid = await trigger('password', { shouldFocus: true });
    const isConfirmPasswordValid = await trigger('confirmPassword', { shouldFocus: true });

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      if (!getValues('checkEmail')) {
        setError('email', {
          type: 'manual',
          message: '이메일 중복 확인을 해주세요.'
        });
        return;
      } else {
        clearErrors('email');
      }

      // session storage에 저장
      setStorage('email', getValues('email'));
      setStorage('checkEmail', getValues('checkEmail'));
      setStorage('password', getValues('password'));
      setStorage('confirmPassword', getValues('confirmPassword'));
      router.push('/auth/signup/step-2');
    }
  };

  const isValid =
    getValues('email') &&
    getValues('password') &&
    getValues('confirmPassword') &&
    getValues('checkEmail') &&
    getValues('password') === getValues('confirmPassword');

  return (
    <>
      <AuthHeader currentStep='1' title='회원가입' />
      <CardContent flexDirection='col' className='mt-32 w-full space-y-20'>
        {/* 이메일 */}
        <FormField
          control={control}
          name='email'
          render={({ field }) => {
            return (
              <FormItem className='w-full '>
                <FormControl>
                  <FlexBox className='w-full gap-x-8'>
                    <div className='relative w-full'>
                      <Input
                        placeholder='이메일을 입력해주세요'
                        id='email'
                        inputMode='email'
                        {...field}
                        validation={errors.email ? 'error' : 'success'}
                      />
                      <ClearInputValueIcon
                        show={Boolean(email)}
                        onClick={() => setValue('email', '')}
                      />
                    </div>
                    <Button
                      name='checkEmail'
                      type='button'
                      size='xs'
                      className='w-[6.5rem] shrink-0 px-0 text-12'
                      onClick={() => mutate(getValues('email'))}
                      disabled={getValues('checkEmail') || isPending}
                    >
                      {isPending ? <Spinner /> : '중복 확인'}
                    </Button>
                  </FlexBox>
                </FormControl>

                {errors.email && (
                  <FormMessage
                    className={`text-12 font-400 ${errors.email.message?.includes('가능한') ? 'text-active' : 'text-warning'}`}
                  />
                )}
              </FormItem>
            );
          }}
        />
        {/* 패스워드 */}
        <FormField
          control={control}
          name='password'
          render={({ field }) => {
            return (
              <FormItem className='relative w-full'>
                <FormControl>
                  <>
                    <Input
                      autoComplete='new-password'
                      autoCorrect='off'
                      placeholder='비밀번호를 입력해주세요'
                      id='password'
                      inputMode='text'
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      validation={errors.password ? 'error' : 'success'}
                    />

                    <ClearInputValueIcon
                      rightMargin
                      show={Boolean(getValues('password'))}
                      onClick={() => setValue('password', '')}
                    />
                    <EyeIcon show={showPassword} setState={setShowPassword} />
                  </>
                </FormControl>
                <FormMessage className='text-12 font-400 text-warning' />
              </FormItem>
            );
          }}
        />
        {/* 패스워드 검증 */}
        <FormField
          control={control}
          name='confirmPassword'
          render={({ field }) => {
            return (
              <FormItem className='relative  w-full'>
                <FormControl>
                  <>
                    <Input
                      autoComplete='new-password'
                      autoCorrect='off'
                      placeholder='비밀번호 재확인'
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...field}
                      validation={errors.confirmPassword ? 'error' : 'success'}
                    />
                    <ClearInputValueIcon
                      rightMargin
                      show={Boolean(getValues('confirmPassword'))}
                      onClick={() => setValue('confirmPassword', '')}
                    />
                    <EyeIcon show={showConfirmPassword} setState={setShowConfirmPassword} />
                  </>
                </FormControl>

                <FormMessage className='text-12 font-400 text-warning' />
              </FormItem>
            );
          }}
        />
      </CardContent>
      <div className='absolute bottom-[3rem] left-0 right-0 mx-auto w-full px-20 pb-32 pt-24 xs:w-[520px]'>
        <Button disabled={!isValid} type='button' className='w-full' onClick={onClickNext}>
          다음
        </Button>
      </div>
    </>
  );
};

export default StepOne;