export default {
  widgets: [
    // {
    //   name: 'sanity-tutorials',
    //   options: {
    //     templateRepoId: 'sanity-io/sanity-template-nextjs-landing-pages'
    //   }
    // },
    { name: 'structure-menu' },
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '6350d6c6c8e9956609baedb7',
                  title: 'Sanity Studio',
                  name: 'sanity-nextjs-landing-pages-studio-zas3wa89',
                  apiId: '40393bfe-aae7-44fa-9909-1f7e4f3232e1'
                },
                {
                  buildHookId: '6350d6c7c8e99565b5baf0aa',
                  title: 'Landing pages Website',
                  name: 'sanity-nextjs-landing-pages-web-odnnpm9o',
                  apiId: '441ef58e-17d6-452a-b4e3-e3523c3b2422'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/Dave-Suzuki/sanity-nextjs-landing-pages',
            category: 'Code'
          },
          { title: 'Frontend', value: 'https://sanity-nextjs-landing-pages-web-odnnpm9o.netlify.app', category: 'apps' }
        ]
      }
    },
    {
      name: 'document-list',
      options: { title: 'Recently edited', order: '_updatedAt desc', limit: 10, types: ['page'] },
      layout: { width: 'medium' }
    },
    { name: 'project-users', layout: { height: 'auto' } }
  ]
}
