import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare, MessageCircle } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

// Define type for submit status
type SubmitStatus = {
  success: boolean;
  message: string;
} | null;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ganti dengan service ID, template ID, dan user ID Anda dari EmailJS
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "rpl@skansaba.dev" // Email tujuan
        },
        "YOUR_USER_ID"
      );

      setSubmitStatus({ success: true, message: "Pesan berhasil dikirim!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus({ success: false, message: "Gagal mengirim pesan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendViaWhatsApp = () => {
    const phoneNumber = "6285174270974"; // Nomor WhatsApp admin (diperbarui)
    const text = `Halo, saya ${formData.name} (${formData.email}).

Subjek: ${formData.subject}

Pesan:
 ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="pb-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <span className="text-primary font-medium">Hubungi Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Kontak
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Kami</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan atau ingin mengetahui lebih lanjut tentang Jurusan RPL SMK Negeri 1 Bantul
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

            {/* Contact Form */}
            <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>

                {submitStatus && (
                  <div className={`p-4 rounded-lg mb-6 ${submitStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subjek</label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Masukkan subjek pesan"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Pesan</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Mengirim..." : "Kirim via Email"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={sendViaWhatsApp}
                      disabled={!formData.name || !formData.message}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Kirim via WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Alamat</h3>
                      <p className="text-muted-foreground">Jl. Parangtritis No.KM.11, Dukuh, Sabdodadi, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55715</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Telepon</h3>
                      <p className="text-muted-foreground">+62 851 7427 0974</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">rpl@skansaba.dev</p>
                      <p className="text-muted-foreground">skansaba.dev.rpl@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Lokasi Kami</h2>
                <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                  <iframe
                    title="Lokasi SMK Negeri 1 Bantul di Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.4752989257574!2d110.35305441477882!3d-7.889908394335283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7b00889ad8f84d%3A0x2e0009ca7815eaf0!2sSMK%20Negeri%201%20Bantul!5e0!3m2!1sid!2sid!4v1655123456789!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label="Peta lokasi SMK Negeri 1 Bantul"
                    className="bg-muted"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;