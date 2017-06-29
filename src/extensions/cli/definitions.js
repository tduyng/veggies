'use strict'

const { expect } = require('chai')

module.exports = ({ Given, When, Then }) => {
    Given(/^I set (?:working directory|cwd) to (.+)$/, function(cwd) {
        this.cli.setCwd(cwd)
    })

    Given(/^(?:I )?set (?:env|environment) (?:var|variable) ([^ ]+): (.*)$/, function(name, value) {
        this.cli.setEnvironmentVariable(name, value)
    })

    Given(/^(?:I )?set (?:env|environment) (?:vars|variables)$/, function(step) {
        this.cli.setEnvironmentVariables(step.rowsHash())
    })

    Given(/^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/, function(signal, _delay, unit) {
        let delay = Number(_delay)
        if (unit === 's') {
            delay = delay * 1000
        }

        this.cli.scheduleKillProcess(delay, signal)
    })



    When(/^I run command (.+)$/, function(command, callback) {
        this.cli
            .run(command)
            .then(() => {
                /* console.log(this.cli.getOutput('stdout'), this.cli.getOutput('stderr')); */ callback()
            })
            .catch((...args) => {
                /* console.log(this.cli.getOutput('stdout'), this.cli.getOutput('stderr')); */ callback(...args)
            })
    })

    When(/^(?:I )?dump (stderr|stdout)/, function(type) {
        const output = this.cli.getOutput(type)
        console.log(output) // eslint-disable-line no-console
    })



    Then(/^(?:the )?(?:command )?exit code should be (\d+)$/, function(expectedExitCode) {
        const exitCode = this.cli.getExitCode()

        expect(exitCode, `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`).to.equal(
            Number(expectedExitCode)
        )
    })

    Then(/^(?:the )?(?:command )?(stderr|stdout) should be empty$/, function(type) {
        const output = this.cli.getOutput(type)

        expect(output).to.be.empty
    })

    Then(/^(?:the )?(?:command )?(stderr|stdout) should contain (.+)$/, function(type, expected) {
        const output = this.cli.getOutput(type)

        expect(output).to.contain(expected)
    })

    Then(/^(?:the )?(?:command )?(stderr|stdout) should not contain (.+)$/, function(type, expected) {
        const output = this.cli.getOutput(type)

        expect(output).to.not.contain(expected)
    })

    Then(/^(?:the )?(?:command )?(stderr|stdout) should match (.+)$/, function(type, regex) {
        const output = this.cli.getOutput(type)

        expect(output).to.match(new RegExp(regex, 'gim'))
    })

    Then(/^(?:the )?(?:command )?(stderr|stdout) should not match (.+)$/, function(type, regex) {
        const output = this.cli.getOutput(type)

        expect(output).to.not.match(new RegExp(regex, 'gim'))
    })
}
