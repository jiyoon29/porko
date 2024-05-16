import type { Metadata } from 'next';
import './globals.css';
import QueryProviders from '@/context/queryProvider';
import AuthProvider from '@/context/authProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  // FIXME -> 추후 메타데이터 수정
  title: 'Create Next App',
  description: 'Generated by create next app'
};
const RootLayout = ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: string;
}>) => {
  console.log(params);
  return (
    <html lang='ko'>
      <body className='mx-auto overflow-hidden text-black xs:w-[520px]'>
        <AuthProvider>
          <QueryProviders>
            {/* XXX 
              바디 구분 위해 의도적으로 색상 넣어놨습니다.
             */}
            <main className='hide-scrollbar relative h-dvh overflow-y-scroll bg-gray-50'>
              {children}
              <Navbar />
            </main>
          </QueryProviders>
        </AuthProvider>
      </body>
    </html>
  );
};
export default RootLayout;
