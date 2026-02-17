import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", businessName: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section
      id='contact'
      className='bg-white/1 backdrop-blur-xl border-t border-white/1 py-12'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4 text-white'>
            Get in Touch
          </h2>
          <p className='text-white/90 text-lg max-w-2xl mx-auto'>
            Have questions? Our team is here to help. Reach out to us anytime.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold mb-8 text-white'>
                Contact Information
              </h3>
              <div className='space-y-6'>
                {/* Email */}
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Mail size={24} className='text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold mb-1 text-white'>Email</h4>
                    <p className='text-white/90'>support@scanfleet.com</p>
                    <p className='text-white/90'>sales@scanfleet.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Phone size={24} className='text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold mb-1 text-white'>Phone</h4>
                    <p className='text-white/90'>+91 (800) 123-4567</p>
                    <p className='text-white/90'>Mon - Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>

                {/* Address */}
                <div className='flex gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <MapPin size={24} className='text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold mb-1 text-white'>Address</h4>
                    <p className='text-white/90'>ScanFleet Technologies</p>
                    <p className='text-white/90'>Assam, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg'>
              <h4 className='font-semibold mb-4 text-white'>Quick Links</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='#'
                    className='text-cyan-400 hover:text-cyan-300 transition-colors'
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href='/api-reference'
                    className='text-cyan-400 hover:text-cyan-300 transition-colors'
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-cyan-400 hover:text-cyan-300 transition-colors'
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-cyan-400 hover:text-cyan-300 transition-colors'
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white/1 backdrop-blur-xl border border-white/10 p-8 rounded-2xl'>
            <h3 className='text-2xl font-bold mb-6 text-white'>
              Send us a Message
            </h3>

            {submitted ? (
              <div className='bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-lg p-6 text-center'>
                <p className='text-cyan-400 font-semibold mb-2'>
                  Thank you for reaching out!
                </p>
                <p className='text-sm text-white/70'>
                  We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                    placeholder='John Doe'
                  />
                </div>

                <div>
                  <label
                    htmlFor='businessName'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    Business Name
                  </label>
                  <input
                    type='text'
                    id='businessName'
                    name='businessName'
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                    placeholder='Your Dealership'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                    placeholder='john@dealership.com'
                  />
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className='w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none text-white placeholder-white/50'
                    placeholder='Tell us about your inquiry...'
                  ></textarea>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0'
                >
                  <Send size={18} className='mr-2' />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
