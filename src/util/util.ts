export function convertSecondToMinutesAndSecond(time: number) {
   const minutes = Math.floor(time / 60);
   const seconds = Math.floor(time - (minutes * 60));
   // const minutes = Math.floor(time / 60);
   // const seconds = Math.floor(time % 60);
   const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

   return `${formattedTime}`;
}

export function convertCurrentDuration(time: any) {
   // Calculate minutes and seconds


   if (time === null || time === 0) {
      return "00:00";
   }

   const minutes = Math.floor(time / 60);
   const seconds = time % 60;

   // Format the minutes and seconds as strings with leading zeros if necessary
   const formattedMinutes = minutes.toString().padStart(2, '0');
   const formattedSeconds = seconds.toString().padStart(2, '0');

   // Combine formatted minutes and seconds into MM:SS format
   return `${formattedMinutes}:${formattedSeconds}`;
}


export function debounce(func: CallableFunction, timeout = 200) {
   let timer: any;

   return (...args: any) => {
      clearTimeout(timer);

      //  @ts-ignore
      timer = setTimeout(() => { func.apply(this, args) }, timeout);
   }
}

export interface FilterInfoType {
   [key: string]: FilterType[]
}

export interface FilterType {
   id: number,
   name: string
}

class CallStack {
   stack: CallableFunction[] = [];
   isFirstCall: boolean = true;

   constructor() {
      this.stack = [];
   }

   push(callback: Function) {
      this.stack.push(callback);

      if (this.isFirstCall) {
         this.isFirstCall = false;
         this.execute();
      }
   }
   // push( callback: Function ) {

   //    this.stack.push( callback );
   //    this.execute();
   //    // if( this.isFirstCall ) {
   //    //    this.isFirstCall = false;

   //    // }
   // }

   execute() {
      if (this.stack.length > 0) {

         const callback = this.stack.shift();
         if (typeof callback === "function") callback(() => this.execute()) // Pass a callback to the function to continue the stack
      } else {
         this.isFirstCall = true;
      }
   }

   empty() {
      this.stack = [];
   }
}

export const callStack = new CallStack();
