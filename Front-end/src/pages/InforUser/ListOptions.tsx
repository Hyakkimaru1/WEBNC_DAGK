import React, { useContext } from "react";
import { ThemeContext } from '@/contexts/ThemeContext';

const ListOptions: React.FC<{
  onClick: (newOption: any) => void;
  option: string;
}> = ({ onClick, option }) => {
    const { theme } = useContext(ThemeContext);
  const handleOnCLick = (e: any) => {
    onClick(e.target.id);
    const optionOne:any = document.getElementById(option);
    const optionTwo:any = document.getElementById(e.target.id);
    if (optionOne && optionTwo){
        optionOne.classList.remove("ListOptions__active");
        optionTwo.classList.add("ListOptions__active");
    }
    
  };
  return (
    <div>
      <ul style={{backgroundColor:theme?.formBackGround}} className="ListOptions">
        <li
          onClick={handleOnCLick}
          id="ListOption1"
          className="ListOptions__item ListOptions__active"
          style={{color:theme?.color}}
        >
          Thông tin tài khoản
        </li>
        <li
          onClick={handleOnCLick}
          id="ListOption2"
          className="ListOptions__item"
          style={{color:theme?.color}}
        >
          Thay đổi mật khẩu
        </li>
      </ul>
    </div>
  );
};

export default ListOptions;
