import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'
import matchAll from 'match-all'
// const axios = require('axios')
// const matchAll = require('match-all')

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const BRANCH_NAME = core.getInput('BRANCH_NAME')
const FETCH_ON_MERGE_PR = core.getInput('FETCH_ON_MERGE_PR')
const JIRA_ISSUE_API_URL = core.getInput('JIRA_ISSUE_API_URL')
const JIRA_AUTH_TOKEN = core.getInput('JIRA_AUTH_TOKEN')
const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

const run = async () => {
  let branch = BRANCH_NAME
  // run checks to update branch name
  try {
    core.info(branch)
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
  let issues: any[] = []
  keys?.forEach(issue => {
    axios
      .get(`${JIRA_ISSUE_API_URL}${issue}`, {
        headers: {
          Authorization: `Basic ${JIRA_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        core.info('yay, output is there')
        core.info(JSON.stringify(res))
        // issues.push(res?.data)
      })
      .catch(err => {
        core.info(err.message)
      })
  })
  core.info(JSON.stringify(issues))
}

run()
