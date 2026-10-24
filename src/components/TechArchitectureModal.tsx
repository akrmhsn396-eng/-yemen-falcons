import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Mountain, 
  ShieldAlert, 
  Eye, 
  Flame, 
  Boxes, 
  Network, 
  Layers, 
  CheckCircle2, 
  X,
  Compass,
  Bomb
} from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mechanics' | 'geography' | 'graphics' | 'database' | 'multiplayer' | 'engine_eval'>('mechanics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden text-stone-100 font-['Cairo',sans-serif] dir-rtl">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl shadow-amber-950/40 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300">
                صقور اليمن: رحلة عبر الزمن | الهيكل التقني والتضاريس
              </h2>
              <p className="text-xs text-stone-400">
                المحرك الرسومي · قاعدة البيانات · التضاريس التكتيكية · اللعب الجماعي أونلاين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/70 overflow-x-auto text-sm font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mechanics'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Flame className="w-4 h-4" />
            آليات تعديل التضاريس أثناء القتال
          </button>

          <button
            onClick={() => setActiveTab('geography')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'geography'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            تأثير جغرافيا اليمن والكمائن
          </button>

          <button
            onClick={() => setActiveTab('graphics')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'graphics'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            المحرك الرسومي (Graphics Engine)
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'database'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            هيكل قاعدة البيانات (Database Schema)
          </button>

          <button
            onClick={() => setActiveTab('multiplayer')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'multiplayer'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Network className="w-4 h-4" />
            تزامن اللعب الجماعي أونلاين
          </button>

          <button
            onClick={() => setActiveTab('engine_eval')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'engine_eval'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Boxes className="w-4 h-4" />
            مقارنة المحركات (Unity vs Unreal)
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-stone-300">
          
          {/* TAB 1: MECHANICS OF TERRAIN MODIFICATION */}
          {activeTab === 'mechanics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200">
                <h3 className="font-bold text-base mb-1 text-amber-300 flex items-center gap-2">
                  <Bomb className="w-5 h-5 text-amber-400" />
                  ديناميكية تعديل التضاريس التفاعلية أثناء المعركة (Deformable Battlefield)
                </h3>
                <p className="text-xs text-amber-200/80">
                  تتميز أرض المعركة بأنها ليست مجرد مجسم ثلاثي الأبعاد ثابت، بل شبكة ارتفاعات ديناميكية (Dynamic Heightfield Buffer) تتفاعل في الوقت الفعلي مع قرارات اللاعب الهجومية والدفاعية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    دفاعي: حفر الخنادق الجبلية (Trenches)
                  </span>
                  <h4 className="font-bold text-stone-100">تحصين المشاة وخفض الارتفاع</h4>
                  <p className="text-xs text-stone-400">
                    تقوم فرقة الهندسة أو المشاة بخفض الارتفاع المحلي بمقدار 1.8 متر. يوفر الخندق حماية بنسبة <strong className="text-amber-400">65% ضد شظايا القصف المدفعي وقذائف الهاون</strong>، وتتحول حالة المشاة تلقائياً إلى وضع التمويه (In-Trench Stealth).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs">
                    دفاعي: إقامة المتاريس الحجرية والمصدات (Ramparts)
                  </span>
                  <h4 className="font-bold text-stone-100">سواتر صد طبيعية للآليات</h4>
                  <p className="text-xs text-stone-400">
                    رفع التضاريس وتكديس صخور البازلت الجبلية حتى ارتفاع 3 أمتار. تعمل كـ <strong className="text-amber-400">مصدات عازلة تعيق تقدم عربات الشاص التكتيكية</strong> للعدو، وتجبرها على سلوك مسالك محددة تسهل تصفيتها بالكمائن.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-xs">
                    هجومي: تفجير الممرات وقصف الحفر الارتجاجية (Cratering)
                  </span>
                  <h4 className="font-bold text-stone-100">نسف المضائق وتدمير الجسور الطبيعية</h4>
                  <p className="text-xs text-stone-400">
                    تتسبب قذائف الهاون الثقيل والصواريخ في إحداث <strong className="text-red-400">حفر انفجارية عميقة (Impact Craters)</strong>، مما يؤدي إلى قطع الجسور الصخرية الطبيعية بين الوديان وتغيير خريطة حركة عربات الخصم بشكل جذري.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-xs">
                    لوجستي: تسوية التضاريس الوعرة (Terrain Flattening)
                  </span>
                  <h4 className="font-bold text-stone-100">تجهيز المواقع لبناء الحصون والمصانع</h4>
                  <p className="text-xs text-stone-400">
                    نظراً لأن جبال اليمن شديدة الوعورة ولا تتيح مساحات مسطحة، يقوم المهندسون بتسوية منحدرات القمم لتجهيز مصاطب صالحة لبناء قلاع القيادة، مخازن العتاد ومحطات تحلية المياه.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GEOGRAPHY & AMBUSH IMPACT */}
          {activeTab === 'geography' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-amber-400" />
                  تأثير التضاريس اليمنية على الحركة، الرؤية، والكمائن المباغتة
                </h3>
                <p className="text-xs text-stone-400">
                  تتميز اليمن بطبيعة جغرافية فريدة تتدرج من قمم جبال السروات وحراز الصخرية الشاهقة، إلى بطون الأودية السحيقة مثل وادي حضرموت ووادي بنا والمدرجات الجبلية العريقة.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-sm whitespace-nowrap">
                    1. القمم الجبلية الشاهقة (Mountain Peaks)
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-200 font-semibold">
                      تأثير الرؤية والقنص: +75% مدى رؤية ومدى إطلاق نار | تمويه صخري: 60%
                    </p>
                    <p className="text-stone-400">
                      تمنح الوحدات المتمركزة في القمم خط رؤية غير محجوب عبر مسافات هائلة، مما يجعل القناصة ومدافع الهاون قادرة على السيطرة النارية الكاملة. في المقابل، تعجز المركبات الآلية عن صعود المنحدرات التي تتجاوز زاويتها 30 درجة.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-sm whitespace-nowrap">
                    2. بطون الأودية والخوانق (Wadis & Ravines)
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-200 font-semibold">
                      حماية الرادار: 80% تمويه جوي | سرعة الآليات: +25% | ميزة الكمين المباغت: +100% ضرر حرج
                    </p>
                    <p className="text-stone-400">
                      الجدران الجبلية العالية تحجب رادارات الدرونات الاستطلاعية. يمكن لعربات الشاص التكتيكية والمشاة التسلل عبر الوادي دون كشفهم، وشن هجوم مباغت يضاعف الضرر للضربة الأولى، لكن البقاء في قاع الوادي يحمل مخاطرة الوقوع في مصيدة نارية إذا سيطر الخصم على الحواف العليا.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-sm whitespace-nowrap">
                    3. المدرجات الحجرية الزراعية (Stone Terraces)
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-200 font-semibold">
                      حركة متدرجة | غطاء ساتر للمشاة: 45% | حركة الآليات: مقيدة بنسبة 40%
                    </p>
                    <p className="text-stone-400">
                      الجدران الصخرية للمدرجات اليمانية تشكل متاريس دفاعية متتالية طبيعية. توفر حماية تكتيكية للمشاة مع إمكانية القفز بين المصاطب أثناء الانسحاب المنظم.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 font-mono text-sm whitespace-nowrap">
                    4. الهضاب الصخرية المفتوحة (Open Plateaus)
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-200 font-semibold">
                      سرعة قصوى: 100% | التمويه: 0% (مكشوف بالكامل للطيران والمدفعية)
                    </p>
                    <p className="text-stone-400">
                      مناطق تتيح الاشتباك والمناورات السريعة، لكنها تشكل مصيدة للموت إذا لم يتوفر غطاء دفاع جوي لحمايتها من الدرونات والراجمات.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GRAPHICS ENGINE */}
          {activeTab === 'graphics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  المحرك الرسومي وتعديل الـ Mesh في الوقت الحقيقي (Three.js WebGL/WebGPU)
                </h3>
                <p className="text-xs text-stone-400">
                  تم بناء المحرك الرسومي باستخدام Three.js بتطبيق معايير PBR، واستخدام مصفوفات الارتفاعات اللحظية لتعديل تضاريس المعركة دون هبوط معدل الإطارات (60 FPS ثابت على الجوال).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs">1. Dynamic Vertex Buffer Modification</h4>
                  <p className="text-xs text-stone-300">
                    يتم تخزين التضاريس في <code className="text-amber-300 font-mono">Float32Array</code> مسطح يحتوي على 10,201 نقطة. عند حدوث انفجار أو حفر خندق، تُعدل الإحداثيات المتأثرة بمصفوفة هبوط خطية ناعمة (Hermite Smoothstep)، ثم يُعاد حساب النواظم <code className="text-amber-300 font-mono">computeVertexNormals()</code> في جزء من الملي ثانية.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs">2. Terrain Texture Splatting</h4>
                  <p className="text-xs text-stone-300">
                    توليد إجرائي بالكامل (Procedural Generation) يمزج صخور البازلت الداكنة، والتربة الجبلية المغبرة، ورمال الوادي، مع زوايا الانحدار (Slope-based blending) بدون الاعتماد على أي صور خارجية، مما يضمن تحميل فوري وسفر استهلاك بيانات صفر.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs">3. Mobile Frame Budget & Battery Saving</h4>
                  <p className="text-xs text-stone-300">
                    عزل الـ Canvas تماماً عن دورات React Re-render، وتحديد سقف دقة العرض على شاشات الجوال إلى <code className="text-amber-300 font-mono">Math.min(devicePixelRatio, 2)</code>، واستخدام <code className="text-amber-300 font-mono">RoomEnvironment</code> مسبقة الاحتساب للإضاءة الواقعية بدون استنزاف البطارية.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs">4. Line of Sight & Ballistic Simulation</h4>
                  <p className="text-xs text-stone-300">
                    مسارات المقذوفات تتبع منحنيات فيزيائية قطع مكافئ حقيقية (Parabolic Arc) ترتفع فوق قمم الجبال لحساب سقوط قذائف الهاون بدقة في الوديان العميقة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE SCHEMA */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  هيكل قاعدة البيانات المفصل وقابلية التوسع لملايين اللاعبين (Scalable DB Architecture)
                </h3>
                <p className="text-xs text-stone-400">
                  تم تصميم قاعدة البيانات بنظام هجين يجمع بين <strong className="text-amber-400">PostgreSQL / Cloud SQL Relational DB</strong> مع تقسيم أفقي (Sharding & Partitioning) لإدارة الحسابات، القواعد، والمعاملات المالية الدقيقة (ACID Compliance)، بالإضافة إلى كوليكشنات وثائقية في <strong className="text-emerald-400">Firebase Firestore</strong> للمزامنة المباشرة، و<strong className="text-purple-400">Redis In-Memory Cluster</strong> لمعالجة تيكات المعركة (Tick Rate 30Hz).
                </p>
              </div>

              {/* Grid of the 5 requested DB Entities */}
              <div className="space-y-4">
                
                {/* 1. Players Table */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">TABLE 1</span>
                      جدول اللاعبين (players & player_profiles)
                    </span>
                    <span className="text-xs text-stone-400 font-mono">Primary Key: id (UUID v4)</span>
                  </div>
                  <div className="overflow-x-auto text-xs font-mono text-stone-300">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="text-stone-400 border-b border-stone-800">
                          <th className="py-1 px-2">الحقل (Field)</th>
                          <th className="py-1 px-2">النوع (Type)</th>
                          <th className="py-1 px-2">الفهارس (Index)</th>
                          <th className="py-1 px-2">الوصف التكتيكي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900 text-stone-300">
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">id</td>
                          <td className="py-1.5 px-2 text-stone-400">UUID</td>
                          <td className="py-1.5 px-2 text-emerald-400">PK, B-Tree</td>
                          <td className="py-1.5 px-2">المعرف الفريد لحساب القائد العسكري</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">auth_uid</td>
                          <td className="py-1.5 px-2 text-stone-400">VARCHAR(128)</td>
                          <td className="py-1.5 px-2 text-emerald-400">UNIQUE</td>
                          <td className="py-1.5 px-2">معرف تسجيل الدخول عبر Firebase Auth / Google</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">callsign</td>
                          <td className="py-1.5 px-2 text-stone-400">VARCHAR(32)</td>
                          <td className="py-1.5 px-2 text-stone-400">Index</td>
                          <td className="py-1.5 px-2">الاسم الحركي للقائد (مثال: صقر_حراز)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">military_rank</td>
                          <td className="py-1.5 px-2 text-stone-400">ENUM</td>
                          <td className="py-1.5 px-2 text-stone-400">-</td>
                          <td className="py-1.5 px-2">الرتبة العسكرية: [ملازم, نقيب, رائد, عقيد, عميد, لواء]</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">mmr_rating</td>
                          <td className="py-1.5 px-2 text-stone-400">INTEGER</td>
                          <td className="py-1.5 px-2 text-emerald-400">B-Tree (Desc)</td>
                          <td className="py-1.5 px-2">نقاط تصنيف المواجهات الجماعية (Matchmaking Rating)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">stats_summary</td>
                          <td className="py-1.5 px-2 text-stone-400">JSONB</td>
                          <td className="py-1.5 px-2 text-purple-400">GIN Index</td>
                          <td className="py-1.5 px-2">إحصائيات: {`{battlesWon, ambushesExecuted, trenchesDug, damageDealt}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Bases & Buildings */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">TABLE 2</span>
                      جدول القواعد والمباني الجبلية (player_bases & base_buildings)
                    </span>
                    <span className="text-xs text-stone-400 font-mono">FK: player_id -&gt; players(id)</span>
                  </div>
                  <div className="overflow-x-auto text-xs font-mono text-stone-300">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="text-stone-400 border-b border-stone-800">
                          <th className="py-1 px-2">الحقل (Field)</th>
                          <th className="py-1 px-2">النوع (Type)</th>
                          <th className="py-1 px-2">الوصف التكتيكي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900 text-stone-300">
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">base_id</td>
                          <td className="py-1.5 px-2 text-stone-400">UUID</td>
                          <td className="py-1.5 px-2">المعرف الفريد للقاعدة الحصينة</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">topography_zone</td>
                          <td className="py-1.5 px-2 text-stone-400">VARCHAR(64)</td>
                          <td className="py-1.5 px-2">المنطقة الجغرافية في اليمن: 'haraz_pinnacle' أو 'hadramout_valley'</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">world_x, world_z</td>
                          <td className="py-1.5 px-2 text-stone-400">FLOAT(4)</td>
                          <td className="py-1.5 px-2">إحداثيات مركز القيادة على شبكة تضاريس اليمن</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">buildings_layout</td>
                          <td className="py-1.5 px-2 text-stone-400">JSONB (Array)</td>
                          <td className="py-1.5 px-2">مصفوفة المباني: {`[{type: 'citadel_hq', level: 4, hp: 2000, gridX: -28, gridZ: 32}]`}</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">fortification_state</td>
                          <td className="py-1.5 px-2 text-stone-400">JSONB</td>
                          <td className="py-1.5 px-2">بيانات المتاريس الصخرية المحيطة والخنادق النشطة ونقاط المدافع</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Resources System */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">TABLE 3</span>
                      جدول الموارد والإنتاج اللوجستي (player_resources)
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">Lazy Production Calculation</span>
                  </div>
                  <div className="text-xs text-stone-400 leading-relaxed space-y-2">
                    <p>
                      لتجنب تحديث ملايين الصفوف كل ثانية على السيرفر، يتم تطبيق تقنية <strong className="text-amber-300">Lazy-Evaluation</strong>: يتم تخزين الكمية الثابتة مع ختم زمني <code className="text-amber-400 font-mono">last_collected_at</code> ومعدل الإنتاج <code className="text-amber-400 font-mono">rate_per_sec</code>، وتُحسب الزيادة لحظياً فقط عند طلب اللاعب أو حدوث تفاعل:
                    </p>
                    <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 font-mono text-[11px] text-amber-200">
                      CurrentAmount = MIN(max_capacity, stored_amount + (NOW() - last_collected_at) * rate_per_sec)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                      <div className="text-sky-400 font-bold">💧 المياه العذبة (water)</div>
                      <div className="text-[10px] text-stone-400">إنتاج الآبار والواحات</div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                      <div className="text-amber-400 font-bold">🪨 الصخور (stone)</div>
                      <div className="text-[10px] text-stone-400">محاجر البازلت والتحصينات</div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                      <div className="text-orange-400 font-bold">⛽ الوقود (fuel)</div>
                      <div className="text-[10px] text-stone-400">طاقة الشاصات والمولدات</div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                      <div className="text-red-400 font-bold">💥 الذخائر (ammo)</div>
                      <div className="text-[10px] text-stone-400">مسبك قذائف الهاون</div>
                    </div>
                  </div>
                </div>

                {/* 4. Units Table */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">TABLE 4</span>
                      جدول الوحدات والقدرات التكتيكية (military_units & deployed_forces)
                    </span>
                    <span className="text-xs text-stone-400 font-mono">Spatial PostGIS Index</span>
                  </div>
                  <div className="overflow-x-auto text-xs font-mono text-stone-300">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="text-stone-400 border-b border-stone-800">
                          <th className="py-1 px-2">الحقل (Field)</th>
                          <th className="py-1 px-2">النوع (Type)</th>
                          <th className="py-1 px-2">الوصف التكتيكي الجبلي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900 text-stone-300">
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">unit_type</td>
                          <td className="py-1.5 px-2 text-stone-400">ENUM</td>
                          <td className="py-1.5 px-2">['infantry', 'technical', 'mortar', 'drone', 'engineer']</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">terrain_capabilities</td>
                          <td className="py-1.5 px-2 text-stone-400">JSONB</td>
                          <td className="py-1.5 px-2">{`{canClimbCliffs: true, wadiAmbushBonus: 2.0, trenchDefense: 0.65}`}</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">current_position</td>
                          <td className="py-1.5 px-2 text-stone-400">GEOMETRY(PointZ)</td>
                          <td className="py-1.5 px-2">إحداثيات ثلاثية الأبعاد (X, Y الارتفاع الجبلي, Z) بفهرس GiST</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-amber-300">status</td>
                          <td className="py-1.5 px-2 text-stone-400">VARCHAR(32)</td>
                          <td className="py-1.5 px-2">'in_trench', 'camouflaged_in_rocks', 'ambushing_in_wadi', 'moving'</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Battle Matches & Terrain Deltas */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">TABLE 5</span>
                      جدول نتائج المعارك وفوارق التضاريس (battle_matches & terrain_deltas)
                    </span>
                    <span className="text-xs text-purple-400 font-mono">Replay & Audit System</span>
                  </div>
                  <div className="space-y-2 text-xs text-stone-300">
                    <p>
                      يسجل تفاصيل المعركة: المهاجم والمدافع، التضاريس التي تم تعديلها وحفرها (Craters & Trenches Deltas)، كميات الغنائم المنهوبة من المياه والصخور والوقود، وسلسلة الأحداث لإعادة تشغيل المعركة (Battle Replay).
                    </p>
                    <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-400">
                      terrain_deltas_log: [ {`{x: 12.4, z: -18.2, radius: 4.5, deltaHeight: 2.2, type: 'crater', tick: 420}`} ]
                    </div>
                  </div>
                </div>

                {/* Performance & Scalability Strategy */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 to-amber-950/40 border border-amber-600/40 space-y-2 text-xs">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    استراتيجيات الأداء وقابلية التوسع (High Concurrency & Scalability)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-stone-300 pr-2">
                    <li><strong className="text-stone-100">تقسيم أفقي لقواعد البيانات (Database Sharding):</strong> شارد لكل منطقة جغرافية أو نطاق تصنيف MMR لتقليل التزاحم على الأقفال (Row-Lock Contention).</li>
                    <li><strong className="text-stone-100">فهارس PostGIS و Spatial GiST:</strong> لتسريع استعلامات الرؤية القريبة (Find units within 50 meters) في أقل من 2 ملي ثانية.</li>
                    <li><strong className="text-stone-100">عزل تيكات المعركة في Redis:</strong> تنفيذ محاكاة الـ 30Hz في ذاكرة رام سريعة ثم حفظ الملخص النهائي دفعة واحدة (Batch Write-back) في قاعدة البيانات عند انتهاء المعركة.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: MULTIPLAYER NETWORKING */}
          {activeTab === 'multiplayer' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                  <Network className="w-5 h-5 text-amber-400" />
                  بروتوكول تزامن المعارك وتعديل التضاريس عبر الإنترنت (Multiplayer Sync)
                </h3>
                <p className="text-xs text-stone-400">
                  تعتمد الألعاب الاستراتيجية التي تحتوي على تضاريس قابلة للتعديل على معمارية <strong className="text-amber-400">Authoritative Server with Delta Compression</strong> لضمان انخفاض استهلاك باقات بيانات الجوال إلى أقل من 2 كيلوبايت بالثانية.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-stone-100 text-sm block">1. Delta Terrain Updates (بث الفوارق فقط)</strong>
                    <p className="text-stone-400">
                      بدلاً من إرسال كامل شبكة التضاريس عند كل انفجار أو حفر خندق، يتم إرسال حزمة بيانات متناهية الصغر: <code className="text-amber-300 font-mono">[x, z, radius, deltaHeight, type]</code>. يقوم عميل الخصم بتطبيق نفس معادلة الـ Deform محلياً في نفس التيك، مما يمنع أي لاغ (Lag).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-stone-100 text-sm block">2. Fog of War & Stealth Cryptography</strong>
                    <p className="text-stone-400">
                      الوحدات المتخفية في بطون الأودية (Wadi Ambush) أو في الخنادق لا يتم إرسال إحداثياتها إلى هاتف الخصم إطلاقاً عبر خادم السيرفر، لمنع أي برامج غش أو استخراج بيانات، وتُرسل فقط عند اقتراب دورية كشف أو درون استطلاعي.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-stone-100 text-sm block">3. WebRTC DataChannels منخفضة التأخير</strong>
                    <p className="text-stone-400">
                      استخدام قنوات WebRTC الثنائية المباشرة (Peer-to-Peer) بين أجهزة اللاعبين لتقليل زمن الاستجابة إلى ما دون 40 ملي ثانية حتى على شبكات الجيل الرابع 4G المتنقلة في المناطق الوعرة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GAME ENGINE EVALUATION (UNITY VS UNREAL ENGINE 5) */}
          {activeTab === 'engine_eval' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-400" />
                  المحرك الرسومي الموصى به ومقارنة محركات الألعاب (Unity vs Unreal Engine 5)
                </h3>
                <p className="text-xs text-stone-400">
                  تتطلب لعبة استراتيجية حربية ثلاثية الأبعاد على الجوال بتضاريس يمنية وعرة قابلة للتعديل اللحظي ومئات الوحدات، محركاً يجمع بين: <strong className="text-amber-400">كفاءة معمارية البيانات (Data-Oriented Tech)</strong>، وتعديل شبكات التضاريس اللحظي، واستهلاك حراري وكهربائي منخفض على البطارية.
                </p>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>المحرك الموصى به رسميًا: Unity 6 (بخط أنابيب URP + DOTS/ECS)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  على الرغم من القوة الرسومية الهائلة لـ Unreal Engine 5، فإن <strong className="text-amber-300">Unity بميزان URP و C# DOTS</strong> هو الخيار الأفضل تقنياً لألعاب الاستراتيجية (RTS) على الهواتف، بفضل دعمه المباشر لمحاكاة آلاف الوحدات في الذاكرة دون خنق المعالج (CPU Thermal Throttling) ودعمه الفائق للتعديل اللحظي لشبكات الـ Mesh وبناء الـ NavMesh أثناء القتال.
                </p>
              </div>

              {/* Detailed Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Unity Engine */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-400 text-sm">1. Unity 6 (URP + DOTS)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">الخيار المثالي للجوال</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-emerald-400 block mb-0.5">المزايا الحاسمة:</strong>
                      <ul className="list-disc list-inside text-stone-300 space-y-1 pr-1">
                        <li><strong>معمارية DOTS / ECS:</strong> محاكاة مئات الوحدات (مشاة، شاصات، صواريخ) بأقصى سرعة مع معالجة متعددة الأنوية (Burst Compiler & C# Jobs).</li>
                        <li><strong>تعديل التضاريس والـ NavMesh:</strong> مكتبة <code className="text-amber-300 font-mono">NavMeshSurface.BuildNavMesh()</code> تدعم التحديث اللحظي الجزئي للخرائط عند حفر الخنادق أو نسف الممرات.</li>
                        <li><strong>حجم الحزمة واستهلاك البطارية:</strong> حجم التطبيق صغير (حوالي 80-150MB) واستهلاك حراري منخفض يمنع هبوط الإطارات بعد 10 دقائق من اللعب.</li>
                        <li><strong>تظليل المياه والتضاريس:</strong> باستخدام Shader Graph لإنشاء مياه الأودية وسيلان السيول الجبلية بسهولة.</li>
                      </ul>
                    </div>

                    <div className="pt-1">
                      <strong className="text-red-400 block mb-0.5">العيوب:</strong>
                      <p className="text-stone-400">
                        يتطلب برمجة متقدمة للاستفادة الكاملة من نظام ECS بدلاً من MonoBehaviours التقليدي.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unreal Engine 5 */}
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-sky-400 text-sm">2. Unreal Engine 5.4+</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-xs font-bold">رسومات بصرية خارقة</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-emerald-400 block mb-0.5">المزايا الحاسمة:</strong>
                      <ul className="list-disc list-inside text-stone-300 space-y-1 pr-1">
                        <li><strong>Lumen و Nanite:</strong> هندسة تفاصيل تضاريس مجهرية لصخور الجبال، ولكنها مقتصرة على أحدث هواتف الفئة الرائدة (Flagship Snapdragon 8 Gen 3 / Apple A17+).</li>
                        <li><strong>نظام Niagara للمؤثرات:</strong> محاكاة بصرية خرافية لدخان الانفجارات وغبار المعارك في الوديان.</li>
                        <li><strong>نظام Mass Entity:</strong> معمارية ECS مدمجة في المحرك لإدارة الحشود العسكرية.</li>
                      </ul>
                    </div>

                    <div className="pt-1">
                      <strong className="text-red-400 block mb-0.5">العيوب القاتلة للجوال:</strong>
                      <ul className="list-disc list-inside text-stone-400 space-y-1 pr-1">
                        <li><strong>حجم الحزمة الضخم:</strong> تتجاوز اللعبة غالباً 1.5 إلى 3 جيجابايت كحد أدنى.</li>
                        <li><strong>الاختناق الحراري (Thermal Throttling):</strong> استهلاك عنيف للبطارية وارتفاع حرارة الهاتف، مما يجبر المعالج على خفض التردد لـ 20-30 FPS.</li>
                        <li><strong>تعقيد تعديل الـ Landscape في الران تايم:</strong> نظام Landscape في Unreal مصمم لبيئات ثابتة؛ تعديل التضاريس أثناء القتال يتطلب نظام Voxel مخصص عبر C++.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Technical Requirements Checklist */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2 text-xs">
                <h4 className="font-bold text-amber-300 text-sm">متطلبات البنية التحتية الرسومية المقترحة لمشروع الجوال:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                    <strong className="text-amber-400 block">Render Pipeline:</strong>
                    <span>Unity Universal Render Pipeline (URP) مع Forward+ Lighting</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                    <strong className="text-amber-400 block">Terrain Modification:</strong>
                    <span>Compute Shader Vertex Displacement + Dynamic NavMesh Rebuild</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                    <strong className="text-amber-400 block">Unit Instancing:</strong>
                    <span>GPU Instancing عبر Graphics.DrawMeshInstancedIndirect</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                    <strong className="text-amber-400 block">Water Simulation:</strong>
                    <span>Screen-space Refraction + Dynamic Flow Map لسيول الوديان</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-950 border-t border-stone-800 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>نظام محاكاة التضاريس اليمنية ثلاثي الأبعاد جاهز ونشط</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-all shadow-md hover:shadow-amber-600/30"
          >
            العودة لساحة المعركة
          </button>
        </div>

      </div>
    </div>
  );
};
