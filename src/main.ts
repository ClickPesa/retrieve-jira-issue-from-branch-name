import * as core from '@actions/core'
import axios from 'axios'

const BRANCH_NAME = core.getInput('BRANCH_NAME')
const JIRA_ISSUE_API_URL = core.getInput('JIRA_ISSUE_API_URL')

async function run() {
  try {
    core.info('Hell world')
    // fetch jira issue
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
