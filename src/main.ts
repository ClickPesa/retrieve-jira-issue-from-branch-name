import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const BRANCH_NAME = core.getInput('BRANCH_NAME')
const FETCH_ON_MERGE_PR = core.getInput('FETCH_ON_MERGE_PR')
const JIRA_ISSUE_API_URL = core.getInput('JIRA_ISSUE_API_URL')
const JIRA_AUTH_TOKEN = core.getInput('JIRA_AUTH_TOKEN')
const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

async function run() {
  try {
    core.info('Hell world')
    core.info(JIRA_ISSUE_API_URL)
    if (BRANCH_NAME) {
      core.info(BRANCH_NAME)
      fetch_issue('TO-169')
    } else if (!BRANCH_NAME && FETCH_ON_MERGE_PR) {
    } else {
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const fetch_issue = (issue: any) => {
  core.info(`${JIRA_ISSUE_API_URL}/${issue}`)
  axios
    .get(`${JIRA_ISSUE_API_URL}/${issue}`, {
      headers: {
        Authorization: `Basic ${JIRA_AUTH_TOKEN}`
      }
    })
    .then((res: any) => {
      core.info(res)
    })
    .catch((err: any) => {
      core.info(err.message)
    })
}

run()
