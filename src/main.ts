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
  try {
    // core.info('Hell world')
    // core.info(JIRA_ISSUE_API_URL)
    if (BRANCH_NAME) {
      // core.info(BRANCH_NAME)
      fetch_issue(retrieve_issue_keys(BRANCH_NAME))
    } else if (!BRANCH_NAME && FETCH_ON_MERGE_PR) {
    } else {
    }
  } catch (error) {
    console.log(error.message)
    // if (error instanceof Error) core.setFailed(error.message)
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
      .get(`${JIRA_ISSUE_API_URL}/${issue}`, {
        headers: {
          Authorization: `Basic ${JIRA_AUTH_TOKEN}`
        }
      })
      .then(res => {
        core.info(res.data)
        // console.log(res.data)
        // issues.push(res?.data)
      })
      .catch(err => {
        // console.log(err.code)
        core.info(err.message)
      })
  })
  core.info(JSON.stringify(issues))
}

run()
