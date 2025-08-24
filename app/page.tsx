import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Shield, BarChart3, Linkedin, Github } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EventEase</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/events"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Browse Events
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Manage Events with <span className="text-blue-600">Ease</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create, manage, and track your events effortlessly. From small
          gatherings to large conferences, EventEase provides all the tools you
          need for successful event management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Managing Events
            </Button>
          </Link>
          <Link href="/events">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 bg-transparent"
            >
              Browse Public Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Event Success
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Event Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and customize events with detailed information,
                scheduling, and capacity management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>RSVP Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track attendee responses, manage guest lists, and send automated
                confirmations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure access control with Admin, Staff, and Event Owner roles
                for team collaboration.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Analytics & Export</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate reports, export attendee data to CSV, and track event
                performance metrics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of event organizers who trust EventEase for their
            event management needs.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center space-y-4">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">EventEase</span>
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EventEase. All rights reserved. <br />
            Built with <span className="font-semibold">Next.js</span> and{" "}
            <span className="font-semibold">Supabase</span>.
          </p>

          {/* Personal Info */}
          <div className="text-gray-400 text-sm space-y-1">
            <p>
              Developed by{" "}
              <span className="font-medium text-white">Naveenprasanth T</span>
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="https://github.com/NaveenprasanthT"
                target="_blank"
                className="flex items-center space-x-1 hover:text-white transition"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/naveennp07"
                target="_blank"
                className="flex items-center space-x-1 hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
