import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const BRANCH_NAME = core.getInput('BRANCH_NAME')
const FETCH_ON_MERGE_PR = core.getInput('FETCH_ON_MERGE_PR')
const JIRA_ISSUE_API_URL = core.getInput('JIRA_ISSUE_API_URL')
const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

async function run() {
  try {
    core.info('Hell world')
    // fetch branch name if not provided
    // fetch jira issue
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
