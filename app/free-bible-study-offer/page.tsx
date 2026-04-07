import { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Free Bible Study',
  description: 'Sign up for a free Bible study course from Lehigh Valley Baptist Church.',
}

async function getBibleStudies() {
  if (!client) return []
  try {
    return await client.fetch(`*[_type == "bibleStudy"] | order(course asc, lessonNumber asc){ _id, title, slug, course, lessonNumber }`)
  } catch {
    return []
  }
}

export default async function BibleStudyPage() {
  const studies = await getBibleStudies()

  // Group by course
  const courses: Record<string, any[]> = {}
  studies.forEach((s: any) => {
    const key = s.course || 'Other'
    if (!courses[key]) courses[key] = []
    courses[key].push(s)
  })

  return (
    <>
      <div
        className="py-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-mint), var(--lvbc-primary))' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Bible Study</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto px-4">
          Study God's Word at your own pace with our free Bible study courses.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {Object.keys(courses).length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p className="text-lg">Bible study courses coming soon.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(courses).map(([course, lessons]) => (
              <div key={course}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--lvbc-primary)' }}>{course}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessons.map((l: any) => (
                    <Link
                      key={l._id}
                      href={`/${l.slug.current}`}
                      className="glass rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all block"
                    >
                      <div className="flex items-center gap-3">
                        {l.lessonNumber && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: 'var(--lvbc-mint)' }}
                          >
                            {l.lessonNumber}
                          </div>
                        )}
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{l.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
