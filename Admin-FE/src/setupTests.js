import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// https://amzotti.github.io/testing/2015/03/16/what-is-the-difference-between-a-test-runner-testing-framework-assertion-library-and-a-testing-plugin/

// Jest is a test runner, which can run tests in parallel to maximize the performance.
// Jest is an assertion library, where you do not need to install Chai, Should.js etc. to do the assertions.
// Jest is a mocking library, where you do not need to install seperate libraries like proxyquire, sinon, testdouble etc.
// Jest provides the facility to create coverage reports as built-in functionality.
// => Now we are going to use Jest to test the asynchronous data fetching function. Jest is used as a test runner (alternative: Mocha), but also as an assertion utility (alternative: Chai)

// We can distinguish between framework (Mocha) methods and assertion library (Chai) methods by looking at the contents of the it block.
// Methods outside the it block are generally derived from the testing framework.
// Everything within the it block is code coming from the assertion library.
// beforeEach, describe, context, it, are all methods extending from Mocha.
// expect, equal, and exist, are all methods extending from Chai.

// a mock replaces a function call within the test with a fake version.
// That means you grab the name of a function and replace it with a different implementation.

// Mock function explaination
// ご参考に：https://dev.to/jenniferlynparsons/a-bit-about-jest-mocks-2o7k

configure({ adapter: new Adapter(), disableLifecycleMethods: true });
