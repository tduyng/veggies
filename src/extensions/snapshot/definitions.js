'use strict'

import { Then, world } from '@cucumber/cucumber'

export const install = () => {
    /**
     * Checking if an http response body match a snapshot
     */
    Then(/^response body should match snapshot$/, () => {
        world.snapshot.expectToMatch(world.httpApiClient.getResponse().body)
    })

    /**
     * Checking if an http response body match a snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^response json body should match snapshot$/, (table) => {
        let spec = []
        if (table) {
            spec = table.hashes().map((fieldSpec) => ({
                ...fieldSpec,
                value: world.state.populate(fieldSpec.value),
            }))
        }

        world.snapshot.expectToMatchJson(world.httpApiClient.getResponse().body, spec)
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     */
    Then(/^(stderr|stdout) output should match snapshot$/, (type) => {
        world.snapshot.expectToMatch(world.cli.getOutput(type))
    })

    /**
     * Checking a cli stdout or stderr match snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^(stderr|stdout) json output should match snapshot$/, (type, table) => {
        let spec = []
        if (table) {
            spec = table.hashes().map((fieldSpec) => ({
                ...fieldSpec,
                value: world.state.populate(fieldSpec.value),
            }))
        }

        const output = JSON.parse(world.cli.getOutput(type))
        world.snapshot.expectToMatchJson(output, spec)
    })

    /**
     * Checking that a file content matches the snapshot
     * Allow to omit field by checking their type or if they contain a value
     */
    Then(/^file (.+) should match snapshot$/, (file) => {
        return world.fileSystem.getFileContent(world.cli.getCwd(), file).then((content) => {
            world.snapshot.expectToMatch(content)
        })
    })

    /**
     * Checking that a file content matches the snapshot
     */
    Then(/^json file (.+) content should match snapshot$/, (file, table) => {
        let spec = []
        if (table) {
            spec = table.hashes().map((fieldSpec) => ({
                ...fieldSpec,
                value: world.state.populate(fieldSpec.value),
            }))
        }

        return world.fileSystem.getFileContent(world.cli.getCwd(), file).then((content) => {
            const parsedContent = JSON.parse(content)
            world.snapshot.expectToMatchJson(parsedContent, spec)
        })
    })
}
