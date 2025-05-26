const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ToDo Contract", function () {
let todo;

beforeEach(async function () {
    const ToDo = await ethers.getContractFactory("ToDo");
    todo = await ToDo.deploy();
});

it("should create a new task", async function () {
    await todo.createTask("My first task");
    const tasks = await todo.getTasks();

    expect(tasks.length).to.equal(1);
    expect(tasks[0].content).to.equal("My first task");
    expect(tasks[0].completed).to.equal(false);
});
});
