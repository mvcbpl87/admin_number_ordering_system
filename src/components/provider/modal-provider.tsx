'use client';
import { createContext, useContext, useEffect, useState } from "react";
//WIP modalData
type ModalProps ={
    children:React.ReactNode
}

type ModalContextType = {
    isOpen: boolean,
    setOpen:(modal:React.ReactNode, fetchData?:()=>Promise<any>) => void,
    setClose:()=> void
}

export const ModalContext = createContext<ModalContextType>({
    isOpen:false,
    setOpen:(modal:React.ReactNode, fetchData?:()=>Promise<any>) => {},
    setClose:()=> {}
});


export default function ModalProvider({children}:ModalProps){
 const [isModalOpen, setModalOpen] = useState(false);
 const [currentModal, setCurrentModal] = useState<React.ReactNode>(null) ;
 const [isMounted, setIsMounted] = useState(false);
 useEffect(()=>{setIsMounted(true)}, []);

 const setOpen = async(modal : React.ReactNode, fetchData?:()=>Promise<any>)=>{
    if(modal){
        setCurrentModal(modal);
        setModalOpen(true);
    }
 }
 const setClose = ()=>{
    setModalOpen(false);
 }
 if(!isMounted) return;
 return(
 <ModalContext.Provider value={{isOpen:isModalOpen, setOpen, setClose}}>
    {children}
    {currentModal}
 </ModalContext.Provider>
 )
}

export function useModal(){
 const context = useContext(ModalContext);
 if(!context) throw new Error('useModal must be used within the modal provider');
 return context;
}