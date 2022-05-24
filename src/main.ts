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
  console.log(context?.payload)
  // default
  let branch: string = BRANCH_NAME
  core.info(FETCH_ON_MERGE_PR)
  if (!BRANCH_NAME) {
    // check event name
    if (FETCH_ON_MERGE_PR) {
      let pull = null
      // fetch on merge pr
      let pull_number: any = context.payload?.head_commit?.message
        ?.split(' ')
        ?.find(o => o?.includes('#'))
        ?.split('#')[1]
      try {
        const latestPull = await octokit.rest.pulls.get({
          owner: context.payload?.repository?.owner?.login,
          repo: context.payload?.repository?.name,
          pull_number
        })
        // fetch pull request
        pull = latestPull?.data
      } catch (error: any) {
        if (error instanceof Error) core.setFailed(error.message)
      }
      branch = pull?.head?.ref
      core.info(branch)
    } else {
      // fetch on push
      let ref = context?.payload?.ref?.split('/')
      branch = ref[ref.length - 1]
    }
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
  matches.forEach((match: any) => {
    if (!resultArr.find((el: any) => el === match)) {
      resultArr.push(match)
    }
  })
  return resultArr.join(',').toUpperCase().split(',')
}

const fetch_issue = async (keys: string[]) => {
  let issues: any = []
  try {
    keys?.forEach(async (issue: any) => {
      const {data}: any = await axios.get(`${JIRA_ISSUE_API_URL}/${issue}`, {
        headers: {
          Authorization: `Basic ${JIRA_AUTH_TOKEN}`
        }
      })
      issues = [
        ...issues,
        {
          key: data?.key,
          creator: {
            email: data?.fields?.creator?.emailAddress,
            name: data?.fields?.creator?.displayName
          },
          reporter: {
            email: data?.fields?.reporter?.emailAddress,
            name: data?.fields?.reporter?.displayName
          },
          summary: data?.fields?.summary,
          issueType: data?.fields.issuetype?.name,
          project: {
            name: data.fields.project.name,
            key: data.fields.project.key
          },
          parent: {
            key: data?.key,
            summary: data?.fields?.parent.fields.summary,
            issueType: data?.fields.parent.fields.issuetype?.name
          },
          assignee: {
            email: data?.fields?.assignee?.emailAddress,
            name: data?.fields?.assignee?.displayName
          },
          status: data?.fields.status.name
        }
      ]
      core.setOutput('rawIssues', issues)
    })
  } catch (err: any) {
    core.info(err.message)
  }
}

run()
