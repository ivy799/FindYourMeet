"use client"
import Image from "next/image"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "motion/react"
import { Calendar, MapPin, Users, Clock, Shield, Star } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { ModernLogo } from "@/components/ui/modern-logo"

export default function Home() {
  return (
    <div className="font-sans">
      <div className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased bg-white dark:bg-neutral-950 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto p-4 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-500 dark:from-neutral-200 dark:via-neutral-300 dark:to-neutral-600 font-sans font-bold"
          >
            Find Your Perfect Meeting Space
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-neutral-700 dark:text-neutral-400 max-w-2xl mx-auto my-6 text-lg text-center relative z-10"
          >
            Discover the ideal meeting rooms for your team. Connect, collaborate, and achieve more with
            FindYourMeet.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 relative z-10"
          >
            <a
              href="/rooms"
              className="w-full sm:w-auto bg-neutral-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white rounded-lg transition-colors"
            >
              Get started
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Learn more
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </a>
          </motion.div>
        </motion.div>
        <BackgroundBeams />
      </div>

      <motion.div
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 sm:px-16 lg:px-24 bg-neutral-50 dark:bg-neutral-900"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Simple yet powerful features
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Create rooms, join meetings, and find the optimal meeting location for your team with our smart location algorithm.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Smart Location Finding
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  Our algorithm analyzes all team members' locations to find the central point, then shows available meeting places within an optimal radius for everyone.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-8 space-y-4">
                  <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-800"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-200 dark:bg-purple-800"></div>
                  <div className="w-3 h-3 rounded-full bg-pink-200 dark:bg-pink-800"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-800"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-200 dark:bg-purple-800"></div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                    <Image
                      src="/img/img-1.png"
                      alt="Map showing team locations and meeting suggestions"
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded"
                      quality={90}
                      priority
                    />
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-2 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                    <Image
                      src="/img/img-2.png"
                      alt="Meeting room recommendations"
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded"
                      quality={90}
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Create & Join Rooms Instantly
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  Create meeting rooms with unique codes in seconds. Share the code with your team so they can easily join and view the meeting location details.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                <div className="space-y-4">
                  <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Create Room</h4>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Room Name: "Team Sprint Planning"
                      <br />
                      Generated Code: <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">ABC123</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Join with Code</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter room code..."
                        className="flex-1 px-3 py-2 text-sm border rounded bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600"
                        readOnly
                      />
                      <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                        Join
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Meeting Locations</h4>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      📍 Cafe Central (500m from center)
                      <br />
                      📍 Meeting Room A (300m from center)
                      <br />
                      📍 Co-working Space (450m from center)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        id="service"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 sm:px-16 lg:px-24 bg-white dark:bg-neutral-950"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Why Choose FindYourMeet?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover the features that make booking meeting spaces effortless and efficient.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2"
          >
            <AnimatedGridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Calendar className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Easy Booking System"
              description="Book meeting rooms in seconds with our intuitive calendar interface. Real-time availability and instant confirmation."
              delay={0.1}
            />

            <AnimatedGridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<MapPin className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Global Locations"
              description="Access meeting spaces in major cities worldwide. From New York to Tokyo, find the perfect space anywhere."
              delay={0.2}
            />

            <AnimatedGridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Users className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Team Collaboration"
              description="Built for teams of all sizes. Manage bookings, invite colleagues, and collaborate seamlessly."
              delay={0.3}
            />

            <AnimatedGridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Clock className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="24/7 Availability"
              description="Book meeting rooms anytime, anywhere. Our platform works around the clock to serve your needs."
              delay={0.4}
            />

            <AnimatedGridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Shield className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Secure & Reliable"
              description="Enterprise-grade security and 99.9% uptime guarantee. Your bookings are safe with us."
              delay={0.5}
            />
          </motion.ul>
        </div>
      </motion.div>

      <motion.div
        id="pricing"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 sm:px-16 lg:px-24 bg-neutral-50 dark:bg-neutral-900"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Choose the perfect plan for your meeting space needs. All plans include room booking and location finding features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Basic</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">Perfect for individuals and small teams</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">$9</span>
                  <span className="text-neutral-600 dark:text-neutral-400 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Up to <span className="font-semibold">5 room bookings</span> per month
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Basic room search & filtering</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Calendar integration</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Email support</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Mobile app access</span>
                </li>
              </ul>

              <button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 px-6 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-200">
                Not Available For Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-neutral-900 dark:bg-white border-2 border-neutral-900 dark:border-white rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white dark:text-neutral-900 mb-2">Professional</h3>
                <p className="text-neutral-300 dark:text-neutral-600 mb-6">Perfect for growing teams and businesses</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white dark:text-neutral-900">$29</span>
                  <span className="text-neutral-300 dark:text-neutral-600 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-neutral-900 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-200 dark:text-neutral-700">
                    <span className="font-semibold">Unlimited</span> room bookings
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-neutral-900 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-200 dark:text-neutral-700">Advanced location finding with AI</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-neutral-900 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-200 dark:text-neutral-700">
                    Team collaboration for up to <span className="font-semibold">10 members</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-neutral-900 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-200 dark:text-neutral-700">Room code generation & sharing</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-neutral-900 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-200 dark:text-neutral-700">Priority support & dashboard access</span>
                </li>
              </ul>

              <button className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200">
                Not Available For Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Enterprise</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  For large organizations with advanced needs
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">$99</span>
                  <span className="text-neutral-600 dark:text-neutral-400 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Unlimited</span> everything
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Custom API integration</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Unlimited</span> team members
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">Advanced analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-neutral-100 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-700 dark:text-neutral-300">24/7 dedicated support</span>
                </li>
              </ul>

              <button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 px-6 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-200">
                Not Available For Now
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <section id="faq" className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Find answers to common questions about FindYourMeet's core features.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How do I create a meeting room?",
                  answer:
                    "Creating a room is simple! Click 'Create Room', enter a room name, and you'll get a unique room code instantly. Share this code with your team members so they can join the meeting.",
                },
                {
                  question: "How do team members join a room?",
                  answer:
                    "Team members can join by entering the room code you shared with them. Once they join, their location will be added to calculate the optimal meeting spot for everyone.",
                },
                {
                  question: "How does the location finding algorithm work?",
                  answer:
                    "Our smart algorithm calculates the central point based on all team members' locations, then finds available meeting places within an optimal radius. This ensures minimal travel time for everyone.",
                },
                {
                  question: "What types of meeting locations are shown?",
                  answer:
                    "We display various meeting venues within the calculated radius including cafes, co-working spaces, conference rooms, and other suitable meeting places near your team's central location.",
                },
                {
                  question: "Do I need to create an account to use FindYourMeet?",
                  answer:
                    "Yes, you need to create an account to use FindYourMeet. Creating an account allows you to create and join multiple rooms, for better organization.",
                },
                {
                  question: "How accurate is the location-based recommendation?",
                  answer:
                    "Our algorithm uses precise geolocation data to calculate the optimal meeting point. The system considers travel distances for all participants to suggest the most convenient locations for your team.",
                },
                {
                  question: "Can I see who has joined my room?",
                  answer:
                    "Yes! In your room sidebar, you can see all participants who have joined using the room code",
                },
                {
                  question: "Is my location data safe and private?",
                  answer:
                    "Absolutely. We only use location data to calculate optimal meeting points and never store or share precise personal locations. All data is encrypted and used solely for meeting recommendations.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contact">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24 px-6 sm:px-16 lg:px-24 bg-neutral-50 dark:bg-neutral-900"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Have questions or suggestions? Get in touch with us!
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
              If you have any feedback or comments regarding this website, please feel free to contact us.
            </p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                placeholder="john@gmail.com"
                className="flex-1 px-6 py-4 text-base bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors duration-200"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all duration-200 hover:shadow-lg"
              >
                Submit
              </button>
            </motion.form>
          </motion.div>
        </motion.div>
      </section>

      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full border-t bg-background/95 backdrop-blur-sm"
      >
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 font-bold">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-center h-8 w-8 bg-gray-50 dark:bg-gray-800 rounded">
                      <ModernLogo className="h-6 w-6" />
                    </div>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">FindYourMeet</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Find the perfect meeting space for your team. Create rooms, share codes, and discover optimal locations with our smart algorithm.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/rooms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Create Room
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    API Access
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Location Tips
                  </Link>
                </li>
                <li>
                  <Link href="mailto:support@findyourmeet.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8"
          >
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} FindYourMeet. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  delay?: number;
}

const AnimatedGridItem = ({ area, icon, title, description, delay = 0 }: GridItemProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`min-h-[14rem] list-none ${area}`}
    >
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
