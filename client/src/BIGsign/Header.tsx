import { Buttons_Header } from '../Oth_compornents/button';

function Header() {
  return (
    <>
      <header className="sticky top-0 w-full h-auto bg-gray-100 flex items-center justify-center text-center">
        <p className="flex items-center justify-center px-[8%]">これはヘッダーです。</p>
        <div className="flex flex-auto justify-around">
          <Buttons_Header />
        </div>
        <i className="bi bi-gear h-full aspect-square text-2xl flex items-center justify-center"></i>
      </header>
    </>
  );
}

export default Header;