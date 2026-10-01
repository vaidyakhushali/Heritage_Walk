import { Link, useParams } from 'react-router-dom'
import './InformationPage.css'

const informationPages = {
  'community-guidelines': {
    title: 'Community Guidelines',
    intro: 'Help make HeritageWalk a respectful, useful record of the places and stories that matter to local communities.',
    sections: [
      {
        title: 'Respect heritage places and communities',
        paragraphs: [
          'Follow site rules, respect local customs, and never enter restricted or unsafe areas to make a contribution.',
          'Do not share sensitive details that could put vulnerable sites, artifacts, or people at risk.'
        ]
      },
      {
        title: 'Share careful, useful information',
        paragraphs: [
          'Distinguish documented facts from personal memories, oral histories, and uncertain details. Add context or sources when available.',
          'Keep contributions relevant to the heritage site and correct mistakes constructively.'
        ]
      },
      {
        title: 'Upload media responsibly',
        paragraphs: [
          "Only upload photographs and videos you created or have permission to share. Avoid exposing people's private information or photographing them in sensitive situations without consent."
        ]
      },
      {
        title: 'Review and moderation',
        paragraphs: [
          'Submissions are reviewed before they are added to the public catalog. HeritageWalk may decline or remove content that is inaccurate, unsafe, unlawful, or does not follow these guidelines.'
        ]
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'This page explains what information HeritageWalk uses to provide accounts, review contributions, and maintain the heritage catalog.',
    sections: [
      {
        title: 'Information you provide',
        paragraphs: [
          'When you register, we collect your name and email address. You may also add profile details, save sites to a wishlist, or submit descriptions, locations, photographs, and videos.'
        ]
      },
      {
        title: 'How information is used',
        paragraphs: [
          'Account information supports sign-in and profile features. Contribution details help reviewers evaluate submissions and provide attribution when material is approved and published.'
        ]
      },
      {
        title: 'Uploaded media and public content',
        paragraphs: [
          'Contribution photographs and videos are stored with Cloudinary. Submissions remain subject to review; approved contributions and their attribution may be displayed publicly on HeritageWalk.'
        ]
      },
      {
        title: 'Account controls and requests',
        paragraphs: [
          'You can update profile details from your account. To ask about correcting or removing account or contribution information, contact hello@heritagewalk.in.'
        ]
      },
      {
        title: 'Sign-in storage',
        paragraphs: [
          'HeritageWalk stores a sign-in token in your browser so your account remains available between visits. Signing out removes that token from the browser.'
        ]
      }
    ]
  },
  'terms-of-use': {
    title: 'Terms of Use',
    intro: 'By using HeritageWalk, you agree to use the service lawfully and help protect the places and communities represented here.',
    sections: [
      {
        title: 'Using the service',
        paragraphs: [
          "Do not misuse the site, interfere with its operation, attempt to access another person's account, or submit unlawful, misleading, abusive, or harmful material."
        ]
      },
      {
        title: 'Your contributions',
        paragraphs: [
          'You retain ownership of material you create. By submitting it, you give HeritageWalk permission to store, review, format, and display it on the platform if approved. You confirm that you have the rights and permissions needed to submit it.'
        ]
      },
      {
        title: 'Review and publication',
        paragraphs: [
          'Submissions may be reviewed, declined, or removed. Approved material may be shown with contributor attribution as part of the public heritage catalog.'
        ]
      },
      {
        title: 'Heritage information',
        paragraphs: [
          'Site descriptions and historical details may be community-sourced and are not guaranteed to be complete or officially verified. Use them as a starting point and consult authoritative sources where appropriate.'
        ]
      },
      {
        title: 'Changes and availability',
        paragraphs: [
          'Features and these terms may change as the service develops. HeritageWalk is provided as available and may be updated or unavailable from time to time.'
        ]
      }
    ]
  }
}

function InformationPage() {
  const { page } = useParams()
  const content = informationPages[page]

  if (!content) {
    return (
        <div className="information-page">
        <div className="information-page-inner">
          <h1>Information page not found</h1>
          <Link to="/about">Return to About HeritageWalk</Link>
        </div>
        </div>
    )
  }

  return (
    <div className="information-page">
      <header className="information-page-header">
        <div className="information-page-inner">
          <span className="information-kicker">HeritageWalk | Information</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </header>

      <div className="information-page-inner information-page-layout">
        <nav className="information-nav" aria-label="Policies and guidelines">
          {Object.entries(informationPages).map(([slug, item]) => (
            <Link key={slug} to={`/info/${slug}`} aria-current={slug === page ? 'page' : undefined}>
              {item.title}
            </Link>
          ))}
        </nav>

        <article className="information-content">
          {content.sections.map(section => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <aside className="information-contact">
            <div>
              <strong>Questions?</strong>
              <p>Contact HeritageWalk for help or privacy requests.</p>
            </div>
            <a href="mailto:hello@heritagewalk.in">hello@heritagewalk.in</a>
          </aside>
        </article>
      </div>
    </div>
  )
}

export default InformationPage