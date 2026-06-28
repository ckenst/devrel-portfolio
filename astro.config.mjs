import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = process.env.SITE ?? 'https://ckenst.github.io';
const base = process.env.BASE_PATH ?? '/devrel-portfolio';

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'Chris Kenst DevRel Portfolio',
      description:
        'A public developer relations portfolio for technical content, community leadership, and developer experience work.',
      logo: {
        replacesTitle: true,
        src: './src/assets/logo.svg',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ckenst' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/ckenst' },
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ckenst/' },
      ],
      sidebar: [
        {
          label: 'Portfolio',
          items: [
            { label: 'Technical Writing', slug: 'technical-writing' },
            { label: 'Talks & Workshops', slug: 'talks-workshops' },
            { label: 'Code & Demos', slug: 'code-demos' },
            { label: 'Community Leadership', slug: 'community-leadership' },
            { label: 'Product Feedback', slug: 'product-feedback' },
          ],
        },
        {
          label: 'Context',
          items: [{ label: 'About This Portfolio', slug: 'about' }],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/ckenst/devrel-portfolio/edit/main/',
      },
      lastUpdated: true,
    }),
  ],
});
