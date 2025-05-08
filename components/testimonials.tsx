import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Investment Analyst",
      company: "Global Capital Partners",
      image: "/professional-woman-headshot.png",
      quote:
        "This dashboard has transformed how we analyze pharmaceutical companies. The real-time data and comprehensive insights have helped us make more informed investment decisions.",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "VP of Strategy",
      company: "BioTech Innovations",
      image: "/professional-man-headshot.png",
      quote:
        "As a pharmaceutical executive, I rely on this platform daily to track competitor activities and industry trends. The strategic insights have been invaluable for our business planning.",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "Healthcare Consultant",
      company: "Meridian Consulting Group",
      image: "/latina-professional-headshot.png",
      quote:
        "The comprehensive news aggregation and analysis features save me hours of research time. I can quickly identify emerging trends and provide better recommendations to my clients.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <p className="mb-4 text-gray-600">"{testimonial.quote}"</p>
              <div className="mt-auto">
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">
                  {testimonial.title}, {testimonial.company}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
