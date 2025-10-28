import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StudentAchievements = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        setAchievements(data || []);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const getIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'nasional': return Trophy;
      case 'regional': return Medal;
      case 'provinsi': return Star;
      default: return Target;
    }
  };

  const stats = [
    { number: "150+", label: "Alumni Tersertifikasi", icon: "👨‍🎓" },
    { number: "25+", label: "Penghargaan Diraih", icon: "🏆" },
    { number: "95%", label: "Tingkat Kelulusan", icon: "📊" },
    { number: "85%", label: "Langsung Bekerja", icon: "💼" }
  ];

  return (
    <section id="prestasi" className="py-16 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Prestasi Siswa RPL
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Kebanggaan siswa-siswi RPL yang telah mengharumkan nama sekolah 
              di berbagai kompetisi teknologi tingkat regional hingga nasional
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements */}
          {loading ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = getIcon(achievement.level);
                return (
                  <Card key={achievement.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {achievement.photo_url ? (
                          <div className="w-20 h-20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={achievement.photo_url} 
                              alt={achievement.title}
                              className="w-full h-full object-cover rounded-lg border-2 border-primary/20"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {achievement.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {achievement.year}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg text-foreground mb-1">
                            {achievement.title}
                          </CardTitle>
                          <p className="text-sm text-primary font-medium">
                            {achievement.event}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Siswa: {achievement.student}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentAchievements;