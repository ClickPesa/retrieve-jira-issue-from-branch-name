import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'
import matchAll from 'match-all'

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const BRANCH_NAME = core.getInput('BRANCH_NAME')
const FETCH_ON_MERGE_PR = core.getInput('FETCH_ON_MERGE_PR')
const JIRA_ISSUE_API_URL = core.getInput('JIRA_ISSUE_API_URL')
const JIRA_AUTH_TOKEN = core.getInput('JIRA_AUTH_TOKEN')
const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

const run = async () => {
  // default
  let branch: string = BRANCH_NAME
  if (!BRANCH_NAME)
    if (FETCH_ON_MERGE_PR && !BRANCH_NAME) {
      // fetch on merge pr
      branch = ''
    } else {
      // fetch on push
      branch = ''
    }
  // run checks to update branch name
  try {
    fetch_issue(retrieve_issue_keys(branch))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const retrieve_issue_keys = branch => {
  const resultArr = []
  const regex = /((([a-zA-Z]+)|([0-9]+))+-\d+)/g
  const matches = matchAll(branch, regex).toArray()
  matches.forEach(match => {
    if (!resultArr.find(el => el === match)) {
      resultArr.push(match)
    }
  })
  return resultArr.join(',').toUpperCase().split(',')
}

const fetch_issue = async (keys: string[]) => {
  let issues: any = []
  keys?.forEach(async (issue: any) => {
    try {
      const data: any = await axios.get(`${JIRA_ISSUE_API_URL}/${issue}`, {
        headers: {
          Authorization: `Basic ${JIRA_AUTH_TOKEN}`
        }
      })
      core.info(data)
      console.log(JSON.stringify(data, null, 2))
      // core.info(data?.id)
    } catch (err: any) {
      core.info(err.message)
    }
  })
  // core.info(issues)
  // core.info(JSON.stringify(issues))
}

run()

// curl --request GET   --url 'https://clickpesa.atlassian.net/rest/api/3/issue/TO-169' --header 'Authorization: Basic Zy5idW5kYWxhQGNsaWNrcGVzYS5jb206aTI2WnB1NU5WTFlqUHE3RDlqVGwxNzA0'
