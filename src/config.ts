export const config = {
  dryRun: true,

  colors: {
    success: '#339c3c',
    warning: '#ff45b5',
    danger: '#e3001e'
  },

  labels: [
    // By status
    { name: 'status:new', description: '', color: 'ffffff' },
    {
      name: 'status:assigned',
      description: '',
      color: 'ffffff'
    },
    {
      name: 'status:pending code review',
      description: '',
      color: 'ffffff'
    },
    {
      name: 'status:pending qa review',
      description: '',
      color: 'ffffff'
    },
    {
      name: 'status:pending customer review',
      description: '',
      color: 'ffffff'
    },
    { name: 'status:done', description: '', color: 'ffffff' },
    {
      name: 'status:dropped',
      description: '',
      color: 'ffffff'
    },
    // By source
    { name: 'source:internal', description: '', color: 'ffffff' },
    { name: 'source:external', description: '', color: 'ffffff' },
    // By type
    { name: 'type:bug', description: '', color: 'ffffff' },
    { name: 'type:enhancement', description: '', color: 'ffffff' },
    { name: 'type:build', description: '', color: 'ffffff' },
    { name: 'type:question', description: '', color: 'ffffff' },
    // By system
    { name: 'system:frontend', description: '', color: 'ffffff' },
    { name: 'system:backend', description: '', color: 'ffffff' },
    { name: 'system:ci', description: '', color: 'ffffff' },
    { name: 'system:dependencies', description: '', color: 'ffffff' },
    // By size
    { name: 'size:minor', description: '', color: 'ffffff' },
    { name: 'size:small', description: '', color: 'ffffff' },
    { name: 'size:medium', description: '', color: 'ffffff' },
    { name: 'size:large', description: '', color: 'ffffff' },
    // By other tags
    {
      name: 'tagged:awaiting customer response',
      description: '',
      color: 'ffffff'
    },
    {
      name: "tagged:can't reproduce",
      description: '',
      color: 'ffffff'
    },
    {
      name: 'tagged:has pr',
      description: '',
      color: 'ffffff'
    },
    {
      name: 'tagged:pr merged',
      description: '',
      color: 'ffffff'
    },
    {
      name: 'tagged:duplicate customer review',
      description: '',
      color: 'ffffff'
    }
  ],

  members: [
    { github: 'jagmohansingh', slack: '' },
    { github: 'jsullivanlive', slack: '' },
    { github: 'ravgeetdhillon', slack: '' },
    { github: 'BogdanZeleniuk', slack: '' },
    { github: 'vinodguneja', slack: '' },
    { github: 'emilysirianni', slack: '' },
    { github: 'samreetdhillon', slack: '' }
  ],

  responsibilities: {
    // TODO - write a better algorithm to decide from whom the pull request review needs to be taken
    // fileBased: {
    //   css: ['alisa'],
    //   scss: ['alisa'],
    //   js: ['jsullivan']
    // },
    // pathBased: {
    //   '/src/salesforce': ['jagmohan']
    // },
    roleBased: {
      admins: ['jsullivanlive'],
      developers: [
        'jsullivanlive',
        'jagmohansingh',
        'ravgeetdhillon',
        'KumarSunil007',
        'samreetdhillon'
      ],
      qas: ['vinodguneja', 'BogdanZeleniuk', 'emilysirianni']
    }
  },

  owner: 'ravgeetdhillon', // TODO - Change this to `cloudanswers`

  codeReviewersRequired: 1,

  qaReviewersRequired: 1,

  adminReviewersRequired: 1,

  issueAssignedComment:
    '{{assignees}} You have been assigned this issue. Please do your research on this and let us now if you can solve it or not. If you can help us on this, then please **submit a pull request** and **add a reference** to this issue in your pull request.',

  codeReviewRequestComment:
    "{{reviewers}} Please give your code review on this pull request. If everything looks good to you, make sure to give an **approving review**. Then, I'll tag the QA reviewers.",

  qaReviewRequestComment:
    "{{reviewers}} Code reviewers have given their review. Please do QA for this pull request. If everything looks good to you, make sure to give an **approving review**. Then, I'll tag one of the admins to merge this pull request.",

  adminReviewRequestComment:
    '{{reviewers}} Code reviewers and QA reviewers have given their approving reviews. If you are okay with their work, please merge this pull request.',

  pullRequestMergedComment:
    ':purple_heart: Thankyou {{author}} for your amazing work. Your pull request has been merged.'
};
