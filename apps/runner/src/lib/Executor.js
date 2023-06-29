import { VM } from "vm2";

class Executor {
  vm;
  constructor() {
    this.vm = new VM();
  }

  /**
   *
   * @param {string} code
   */
  execute(code) {
    try {
      //   function sleep(milliSeconds) {
      //     var startTime = new Date().getTime(); // get the current time
      //     while (new Date().getTime() < startTime + milliSeconds); // hog cpu until time's up
      //   }
      //   sleep(60);
      return this.vm.run(code);
    } catch (e) {
      console.log("Unable to run");
    }
  }
}

export { Executor };
