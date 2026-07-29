// ============================================================
// 西班牙语学习 - 数据层 (A1阶段)
// ============================================================

// ===== CEFR等级定义 =====
const LEVELS = {
    A1: {
        name: 'A1 - 初级阶段',
        description: '基础入门：字母、发音、基本问候、简单句',
        color: '#10b981',
        lessons: 8
    },
    A2: {
        name: 'A2 - 基础阶段',
        description: '日常会话、过去时态、更多词汇',
        color: '#3b82f6',
        lessons: 0
    },
    B1: {
        name: 'B1 - 中级阶段',
        description: '复杂句、虚拟语气、长文阅读',
        color: '#f59e0b',
        lessons: 0
    },
    B2: {
        name: 'B2 - 中高级阶段',
        description: '流利表达、议论文、文化理解',
        color: '#ef4444',
        lessons: 0
    },
    C1: {
        name: 'C1 - 高级阶段',
        description: '精通级：复杂论证、文学阅读',
        color: '#8b5cf6',
        lessons: 0
    }
};

// ===== A1阶段课程数据 =====
const COURSES = {
    A1: [
        {
            id: 'A1-01',
            title: '第1课：西班牙语字母与发音',
            grammar: `
                <h3>🔤 西班牙语字母表</h3>
                <p>西班牙语使用拉丁字母，共<strong>27个字母</strong>。比英语多一个字母 <strong>Ñ</strong>（ñ）。以下每个字母都可以点击 🔊 听发音：</p>
                
                <table class="alphabet-table">
                    <tr>
                        <th>字母</th><th>名称</th><th>发音</th><th>说明</th><th>示例</th>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>A a</strong></td>
                        <td>a</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('a')">🔊</button></td>
                        <td>元音，读[a]如"啊"，口张开</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('agua')">agua</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>B b</strong></td>
                        <td>be</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('be')">🔊</button></td>
                        <td>读[b]，双唇紧闭爆破</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('bien')">bien</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>C c</strong></td>
                        <td>ce</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ce')">🔊</button></td>
                        <td class="important-note">a/o/u前读[k]；e/i前读[θ]（咬舌尖）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('casa')">casa</button> <button class="speak-btn-sm" onclick="Speaker.speak('cine')">cine</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>D d</strong></td>
                        <td>de</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('de')">🔊</button></td>
                        <td>读[d]，舌尖抵上齿龈</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('dos')">dos</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>E e</strong></td>
                        <td>e</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('e')">🔊</button></td>
                        <td>元音，读[e]嘴型扁平</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('el')">el</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>F f</strong></td>
                        <td>efe</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('efe')">🔊</button></td>
                        <td>读[f]，上牙咬下唇</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('fácil')">fácil</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>G g</strong></td>
                        <td>ge</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ge')">🔊</button></td>
                        <td class="important-note">a/o/u前读[g]；e/i前读[x]（喉咙音）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('gato')">gato</button> <button class="speak-btn-sm" onclick="Speaker.speak('gente')">gente</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>H h</strong></td>
                        <td>hache</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('hache')">🔊</button></td>
                        <td class="important-note">⚠️ 永远<strong>不发音</strong>！</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('hola')">hola</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>I i</strong></td>
                        <td>i</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('i')">🔊</button></td>
                        <td>元音，读[i]如中文"一"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('sí')">sí</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>J j</strong></td>
                        <td>jota</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('jota')">🔊</button></td>
                        <td class="important-note">读[x]喉咙吐气音，如"喝"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('jamón')">jamón</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>K k</strong></td>
                        <td>ka</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ka')">🔊</button></td>
                        <td>读[k]，只用于外来词</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('kilómetro')">km</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>L l</strong></td>
                        <td>ele</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ele')">🔊</button></td>
                        <td>读[l]，舌尖抵上颚</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('lunes')">lunes</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>M m</strong></td>
                        <td>eme</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('eme')">🔊</button></td>
                        <td>读[m]，双唇闭合</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('madre')">madre</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>N n</strong></td>
                        <td>ene</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ene')">🔊</button></td>
                        <td>读[n]，舌尖抵上齿龈</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('no')">no</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>Ñ ñ</strong></td>
                        <td>eñe</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('eñe')">🔊</button></td>
                        <td class="important-note">⭐ 西语特有！读[ɲ]如"尼亚"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('español')">español</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>O o</strong></td>
                        <td>o</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('o')">🔊</button></td>
                        <td>元音，读[o]如"哦"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('sol')">sol</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>P p</strong></td>
                        <td>pe</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('pe')">🔊</button></td>
                        <td>读[p]，双唇爆破（不送气）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('padre')">padre</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>Q q</strong></td>
                        <td>cu</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('cu')">🔊</button></td>
                        <td>读[k]，后必须跟u（que/qui）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('queso')">queso</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>R r</strong></td>
                        <td>erre</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('erre')">🔊</button></td>
                        <td class="important-note">单颤音，舌尖弹上颚一次</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('pero')">pero</button> <button class="speak-btn-sm" onclick="Speaker.speak('perro')">perro</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>S s</strong></td>
                        <td>ese</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ese')">🔊</button></td>
                        <td>读[s]，舌尖靠近上齿龈</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('sí')">sí</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>T t</strong></td>
                        <td>te</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('te')">🔊</button></td>
                        <td>读[t]，舌尖抵上齿（不送气）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('tú')">tú</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>U u</strong></td>
                        <td>u</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('u')">🔊</button></td>
                        <td>元音，读[u]如"乌"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('lunes')">lunes</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>V v</strong></td>
                        <td>uve</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('uve')">🔊</button></td>
                        <td class="important-note">读[b]，与B发音<strong>完全相同</strong>！</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('vaca')">vaca</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>W w</strong></td>
                        <td>uve doble</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('uve doble')">🔊</button></td>
                        <td>读[b]或[w]，只用于外来词</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('wifi')">wifi</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>X x</strong></td>
                        <td>equis</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('equis')">🔊</button></td>
                        <td>读[ks]或[gs]</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('taxi')">taxi</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>Y y</strong></td>
                        <td>ye</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ye')">🔊</button></td>
                        <td>作辅音读[y]如"呀"；单独作词读[i]</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('yo')">yo</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>Z z</strong></td>
                        <td>zeta</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('zeta')">🔊</button></td>
                        <td class="important-note">读[θ]咬舌尖，如英语"think"</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('zapato')">zapato</button></td>
                    </tr>
                </table>

                <h4>📌 特殊组合</h4>
                <table class="alphabet-table">
                    <tr><th>组合</th><th>发音</th><th>说明</th><th>示例</th></tr>
                    <tr>
                        <td class="letter-cell"><strong>CH ch</strong></td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ch')">🔊</button></td>
                        <td>读[tʃ]如"吃"（1994年前是独立字母）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('chico')">chico</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>LL ll</strong></td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('ll')">🔊</button></td>
                        <td class="important-note">读[y]或[ʎ]如"呀"（1994年前是独立字母）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('llamar')">llamar</button></td>
                    </tr>
                    <tr>
                        <td class="letter-cell"><strong>RR rr</strong></td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('rr')">🔊</button></td>
                        <td class="important-note">多颤音！舌尖连续弹动（需练习）</td>
                        <td><button class="speak-btn-sm" onclick="Speaker.speak('perro')">perro</button></td>
                    </tr>
                </table>
                
                <h4>⚠️ 重点注意事项</h4>
                <div class="grammar-tip">
                    <strong>🔊 元音是灵魂：</strong>西班牙语的5个元音 a/e/i/o/u 发音<strong>非常固定</strong>，在任何位置都读同样的音。不像英语元音变化多端。掌握好元音，西语发音就成功了一半！
                </div>
                <div class="grammar-tip">
                    <strong>🤫 H 永远不发音：</strong>字母 H 在任何位置都<strong>不发音</strong>。hola读作"ola"，hablar读作"ablár"。这是初学者最容易忘记的一点！
                </div>
                <div class="grammar-tip">
                    <strong>👅 R 需要练颤音：</strong>单R（pero）舌尖弹一次；双RR（perro）连续弹动。练颤音技巧：嘴里含口水仰头"咕噜咕噜"练舌尖震动。
                </div>
                <div class="grammar-tip">
                    <strong>🦷 C+E/I 和 Z 要咬舌尖：</strong>ce/ci 和 za/ze/zi/zo/zu 都读[θ]——舌尖轻咬上下齿之间，像英语"think"的th音。西班牙本土口音特色！
                </div>
                <div class="grammar-tip">
                    <strong>🎯 B和V发音相同：</strong>在西班牙语中，B和V的发音<strong>没有区别</strong>，都读[b]。bien和vaca的b/v是一样的音！
                </div>
                <div class="grammar-tip">
                    <strong>⭐ Ñ 是西语特色字母：</strong>读作[ɲ]，类似"尼亚"的连读。español（西班牙语）中的ñ就是这个音。这是西语最标志性的字母！
                </div>
                
                <h4>📏 重音规则</h4>
                <div class="grammar-tip">
                    <strong>规则1：</strong>以元音、n或s结尾的词，重音在倒数第二个音节（如 <strong>ca-sa</strong>, <strong>ha-blan</strong>）
                </div>
                <div class="grammar-tip">
                    <strong>规则2：</strong>以其他辅音结尾的词，重音在最后一个音节（如 <strong>a-mor</strong>, <strong>pa-pel</strong>）
                </div>
                <div class="grammar-tip">
                    <strong>规则3：</strong>如果不符合以上规则，重音符号（´）标在重读音节上（如 <strong>ca-fé</strong>, <strong>lá-piz</strong>）
                </div>
            `,
            words: ['hola', 'adiós', 'gracias', 'por favor', 'sí', 'no', 'buenos días', 'buenas noches'],
            examples: [
                { es: 'Hola, ¿cómo estás?', cn: '你好，你怎么样？' },
                { es: 'Gracias, muy bien.', cn: '谢谢，很好。' },
                { es: 'Adiós, hasta luego.', cn: '再见，回头见。' }
            ]
        },
        {
            id: 'A1-02',
            title: '第2课：基本问候与自我介绍',
            grammar: `
                <h3>👋 基本问候语</h3>
                <p>西班牙语的问候有正式和非正式之分，根据时间和对象不同：</p>
                <ul>
                    <li><strong>¡Hola!</strong> — 你好！（最通用的问候，任何时间可用）</li>
                    <li><strong>Buenos días</strong> — 早上好（约到中午12点前）</li>
                    <li><strong>Buenas tardes</strong> — 下午好（约12点到晚上8点）</li>
                    <li><strong>Buenas noches</strong> — 晚上好/晚安（晚上8点后）</li>
                </ul>
                
                <h4>自我介绍</h4>
                <p>用动词 <strong>llamarse</strong>（名叫）来介绍自己的名字：</p>
                <ul>
                    <li><strong>Me llamo...</strong> — 我叫...（字面：我称呼自己为...）</li>
                    <li><strong>¿Cómo te llamas?</strong> — 你叫什么名字？（非正式）</li>
                    <li><strong>¿Cómo se llama usted?</strong> — 您叫什么名字？（正式）</li>
                </ul>
                
                <h4>动词 ser（是）的现在时变位</h4>
                <p>动词 <strong>ser</strong> 是最重要的系动词，表示"是"：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo（我）</td><td><strong>soy</strong></td><td>我是</td></tr>
                    <tr><td>tú（你）</td><td><strong>eres</strong></td><td>你是</td></tr>
                    <tr><td>él/ella/usted（他/她/您）</td><td><strong>es</strong></td><td>他/她是；您是</td></tr>
                    <tr><td>nosotros（我们）</td><td><strong>somos</strong></td><td>我们是</td></tr>
                    <tr><td>vosotros（你们）</td><td><strong>sois</strong></td><td>你们是</td></tr>
                    <tr><td>ellos/ellas/ustedes（他们/她们/诸位）</td><td><strong>son</strong></td><td>他们是；诸位是</td></tr>
                </table>
                
                <h4>实用句型</h4>
                <ul>
                    <li><strong>Soy de China.</strong> — 我来自中国。</li>
                    <li><strong>Soy estudiante.</strong> — 我是学生。</li>
                    <li><strong>¿Eres español?</strong> — 你是西班牙人吗？</li>
                    <li><strong>Mucho gusto.</strong> — 很高兴认识你。</li>
                </ul>
            `,
            words: ['me llamo', 'mucho gusto', 'soy', 'eres', 'es', 'de', 'y', 'tú', 'usted', 'cómo'],
            examples: [
                { es: 'Hola, me llamo María.', cn: '你好，我叫玛丽亚。' },
                { es: 'Mucho gusto, soy de China.', cn: '很高兴认识你，我来自中国。' },
                { es: '¿Eres estudiante? Sí, soy estudiante.', cn: '你是学生吗？是的，我是学生。' }
            ]
        },
        {
            id: 'A1-03',
            title: '第3课：名词的性与数',
            grammar: `
                <h3>🚻 名词的性（Género）</h3>
                <p>西班牙语的名词有<strong>阳性</strong>和<strong>阴性</strong>之分。这是西语最重要的语法特征之一。</p>
                
                <h4>判断规则</h4>
                <ul>
                    <li>以 <strong>-o</strong> 结尾的名词通常是阳性：el libro（书）, el perro（狗）, el chico（男孩）</li>
                    <li>以 <strong>-a</strong> 结尾的名词通常是阴性：la casa（房子）, la mesa（桌子）, la chica（女孩）</li>
                    <li>以 <strong>-ción, -sión, -dad, -tad</strong> 结尾的词通常是阴性：la canción（歌曲）, la ciudad（城市）</li>
                    <li>以 <strong>-ista</strong> 结尾的词可阳可阴：el/la turista（游客）</li>
                </ul>
                
                <h4>定冠词</h4>
                <table class="conjugation-table">
                    <tr><th></th><th>单数</th><th>复数</th></tr>
                    <tr><td>阳性</td><td><strong>el</strong> (el libro)</td><td><strong>los</strong> (los libros)</td></tr>
                    <tr><td>阴性</td><td><strong>la</strong> (la casa)</td><td><strong>las</strong> (las casas)</td></tr>
                </table>
                
                <h4>不定冠词</h4>
                <table class="conjugation-table">
                    <tr><th></th><th>单数</th><th>复数</th></tr>
                    <tr><td>阳性</td><td><strong>un</strong> (un libro)</td><td><strong>unos</strong> (unos libros)</td></tr>
                    <tr><td>阴性</td><td><strong>una</strong> (una casa)</td><td><strong>unas</strong> (unas casas)</td></tr>
                </table>
                
                <h4>名词的数（Número）</h4>
                <p>名词变复数规则：</p>
                <ul>
                    <li>以元音结尾 → 加 <strong>-s</strong>：libro → libros, casa → casas</li>
                    <li>以辅音结尾 → 加 <strong>-es</strong>：ciudad → ciudades, canción → canciones</li>
                    <li>以 <strong>-z</strong> 结尾 → 变 <strong>-ces</strong>：lápiz → lápices</li>
                </ul>
            `,
            words: ['el libro', 'la casa', 'el perro', 'la mesa', 'un', 'una', 'el hombre', 'la mujer', 'el niño', 'la niña'],
            examples: [
                { es: 'El libro es interesante.', cn: '这本书很有趣。' },
                { es: 'La casa es grande.', cn: '这房子很大。' },
                { es: 'Un perro y una gata.', cn: '一只公狗和一只母猫。' }
            ]
        },
        {
            id: 'A1-04',
            title: '第4课：动词变位基础 - AR动词',
            grammar: `
                <h3>📚 动词变位基础</h3>
                <p>西班牙语动词分为三类：<strong>-ar</strong>、<strong>-er</strong>、<strong>-ir</strong>。动词需要根据主语人称进行<strong>变位（conjugación）</strong>。</p>
                <p>这是西语学习的核心内容，每个动词都有六种基本形式。</p>
                
                <h4>-AR 动词现在时变位规则</h4>
                <p>以 <strong>hablar</strong>（说话）为例：去掉词尾 -ar，加上以下词尾：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>词尾</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo</td><td><strong>-o</strong></td><td>hablo</td><td>我说</td></tr>
                    <tr><td>tú</td><td><strong>-as</strong></td><td>hablas</td><td>你说</td></tr>
                    <tr><td>él/ella/usted</td><td><strong>-a</strong></td><td>habla</td><td>他/她/您说</td></tr>
                    <tr><td>nosotros</td><td><strong>-amos</strong></td><td>hablamos</td><td>我们说</td></tr>
                    <tr><td>vosotros</td><td><strong>-áis</strong></td><td>habláis</td><td>你们说</td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>-an</strong></td><td>hablan</td><td>他们/她们/诸位说</td></tr>
                </table>
                
                <h4>常用 -AR 动词</h4>
                <ul>
                    <li><strong>hablar</strong> — 说话</li>
                    <li><strong>estudiar</strong> — 学习</li>
                    <li><strong>trabajar</strong> — 工作</li>
                    <li><strong>escuchar</strong> — 听</li>
                    <li><strong>mirar</strong> — 看</li>
                    <li><strong>comprar</strong> — 买</li>
                    <li><strong>tomar</strong> — 拿、喝</li>
                    <li><strong>llegar</strong> — 到达</li>
                </ul>
                
                <h4>实用例句</h4>
                <ul>
                    <li><strong>Yo hablo español.</strong> — 我说西班牙语。</li>
                    <li><strong>¿Estudias mucho?</strong> — 你学习很多吗？</li>
                    <li><strong>Ella trabaja en una oficina.</strong> — 她在办公室工作。</li>
                    <li><strong>Nosotros compramos fruta.</strong> — 我们买水果。</li>
                </ul>
            `,
            words: ['hablar', 'estudiar', 'trabajar', 'escuchar', 'mirar', 'comprar', 'tomar', 'llegar', 'mucho', 'un poco'],
            examples: [
                { es: 'Yo hablo español y chino.', cn: '我说西班牙语和中文。' },
                { es: '¿Estudias español? Sí, estudio español.', cn: '你学西班牙语吗？是的，我学西班牙语。' },
                { es: 'Ella trabaja en un hospital.', cn: '她在医院工作。' }
            ]
        },
        {
            id: 'A1-05',
            title: '第5课：ER/IR动词变位与数字',
            grammar: `
                <h3>📖 -ER 和 -IR 动词变位</h3>
                
                <h4>-ER 动词现在时变位</h4>
                <p>以 <strong>comer</strong>（吃）为例：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>词尾</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo</td><td><strong>-o</strong></td><td>como</td><td>我吃</td></tr>
                    <tr><td>tú</td><td><strong>-es</strong></td><td>comes</td><td>你吃</td></tr>
                    <tr><td>él/ella/usted</td><td><strong>-e</strong></td><td>come</td><td>他/她/您吃</td></tr>
                    <tr><td>nosotros</td><td><strong>-emos</strong></td><td>comemos</td><td>我们吃</td></tr>
                    <tr><td>vosotros</td><td><strong>-éis</strong></td><td>coméis</td><td>你们吃</td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>-en</strong></td><td>comen</td><td>他们/她们/诸位吃</td></tr>
                </table>
                
                <h4>-IR 动词现在时变位</h4>
                <p>以 <strong>vivir</strong>（生活/居住）为例：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>词尾</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo</td><td><strong>-o</strong></td><td>vivo</td><td>我居住</td></tr>
                    <tr><td>tú</td><td><strong>-es</strong></td><td>vives</td><td>你居住</td></tr>
                    <tr><td>él/ella/usted</td><td><strong>-e</strong></td><td>vive</td><td>他/她/您居住</td></tr>
                    <tr><td>nosotros</td><td><strong>-imos</strong></td><td>vivimos</td><td>我们居住</td></tr>
                    <tr><td>vosotros</td><td><strong>-ís</strong></td><td>vivís</td><td>你们居住</td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>-en</strong></td><td>viven</td><td>他们/她们/诸位居住</td></tr>
                </table>
                
                <h4>数字 1-20</h4>
                <ul>
                    <li>1 uno — 2 dos — 3 tres — 4 cuatro — 5 cinco</li>
                    <li>6 seis — 7 siete — 8 ocho — 9 nueve — 10 diez</li>
                    <li>11 once — 12 doce — 13 trece — 14 catorce — 15 quince</li>
                    <li>16 dieciséis — 17 diecisiete — 18 dieciocho — 19 diecinueve — 20 veinte</li>
                </ul>
                
                <h4>实用例句</h4>
                <ul>
                    <li><strong>¿Dónde vives?</strong> — 你住在哪里？</li>
                    <li><strong>Vivo en Madrid.</strong> — 我住在马德里。</li>
                    <li><strong>¿Qué comes?</strong> — 你吃什么？</li>
                    <li><strong>Ella vive en Barcelona.</strong> — 她住在巴塞罗那。</li>
                </ul>
            `,
            words: ['comer', 'vivir', 'beber', 'escribir', 'leer', 'compartir', 'dónde', 'qué', 'aquí', 'allí'],
            examples: [
                { es: 'Vivo en Beijing, China.', cn: '我住在中国北京。' },
                { es: '¿Qué comes? Como arroz.', cn: '你吃什么？我吃米饭。' },
                { es: 'Ella lee un libro interesante.', cn: '她读一本有趣的书。' }
            ]
        },
        {
            id: 'A1-06',
            title: '第6课：形容词与描述',
            grammar: `
                <h3>🎨 形容词的性数配合</h3>
                <p>西班牙语的形容词必须与所修饰的名词保持<strong>性数一致</strong>。这是西语的重要语法规则。</p>
                
                <h4>形容词变化规则</h4>
                <ul>
                    <li>以 <strong>-o</strong> 结尾的形容词：变 -a 为阴性，加 -s/-as 为复数</li>
                    <li>例：<strong>bueno</strong>（好的）→ buena, buenos, buenas</li>
                    <li>以 <strong>-e</strong> 或辅音结尾的形容词：只变数不变性</li>
                    <li>例：<strong>grande</strong>（大的）→ grandes；<strong>azul</strong>（蓝色的）→ azules</li>
                </ul>
                
                <h4>常用形容词</h4>
                <table class="conjugation-table">
                    <tr><th>阳性单数</th><th>阴性单数</th><th>中文</th></tr>
                    <tr><td>bueno</td><td>buena</td><td>好的</td></tr>
                    <tr><td>malo</td><td>mala</td><td>坏的</td></tr>
                    <tr><td>grande</td><td>grande</td><td>大的</td></tr>
                    <tr><td>pequeño</td><td>pequeña</td><td>小的</td></tr>
                    <tr><td>nuevo</td><td>nueva</td><td>新的</td></tr>
                    <tr><td>viejo</td><td>vieja</td><td>旧的</td></tr>
                    <tr><td>bonito</td><td>bonita</td><td>漂亮的</td></tr>
                    <tr><td>feo</td><td>fea</td><td>丑的</td></tr>
                </table>
                
                <h4>颜色词汇</h4>
                <ul>
                    <li><strong>rojo</strong> — 红色</li>
                    <li><strong>azul</strong> — 蓝色</li>
                    <li><strong>verde</strong> — 绿色</li>
                    <li><strong>blanco</strong> — 白色</li>
                    <li><strong>negro</strong> — 黑色</li>
                    <li><strong>amarillo</strong> — 黄色</li>
                </ul>
                
                <h4>形容词位置</h4>
                <p>西语形容词通常放在名词<strong>之后</strong>：</p>
                <ul>
                    <li><strong>Un libro interesante</strong> — 一本有趣的书（不是"interesante libro"）</li>
                    <li><strong>Una casa blanca</strong> — 一栋白色的房子</li>
                    <li>但数量、品质等限定性形容词可放名词前：<strong>buena idea</strong>（好主意）</li>
                </ul>
            `,
            words: ['bueno', 'malo', 'grande', 'pequeño', 'bonito', 'rojo', 'azul', 'verde', 'blanco', 'negro'],
            examples: [
                { es: 'Tengo un coche rojo.', cn: '我有一辆红色的车。' },
                { es: 'Ella es una buena amiga.', cn: '她是一个好朋友。' },
                { es: 'La casa es grande y blanca.', cn: '这房子又大又白。' }
            ]
        },
        {
            id: 'A1-07',
            title: '第7课：动词 tener 与 estar',
            grammar: `
                <h3>🔑 两个重要动词：tener 和 estar</h3>
                
                <h4>动词 tener（有）的变位</h4>
                <p><strong>Tener</strong> 是"有"的意思，也是不规则动词：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo</td><td><strong>tengo</strong></td><td>我有</td></tr>
                    <tr><td>tú</td><td><strong>tienes</strong></td><td>你有</td></tr>
                    <tr><td>él/ella/usted</td><td><strong>tiene</strong></td><td>他/她/您有</td></tr>
                    <tr><td>nosotros</td><td><strong>tenemos</strong></td><td>我们有</td></tr>
                    <tr><td>vosotros</td><td><strong>tenéis</strong></td><td>你们有</td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>tienen</strong></td><td>他们/她们/诸位有</td></tr>
                </table>
                
                <h4>动词 estar（在/处于）的变位</h4>
                <p><strong>Estar</strong> 表示"在某个地方"或"处于某种状态"：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>变位</th><th>中文</th></tr>
                    <tr><td>yo</td><td><strong>estoy</strong></td><td>我在</td></tr>
                    <tr><td>tú</td><td><strong>estás</strong></td><td>你在</td></tr>
                    <tr><td>él/ella/usted</td><td><strong>está</strong></td><td>他/她/您在</td></tr>
                    <tr><td>nosotros</td><td><strong>estamos</strong></td><td>我们在</td></tr>
                    <tr><td>vosotros</td><td><strong>estáis</strong></td><td>你们在</td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>están</strong></td><td>他们/她们/诸位在</td></tr>
                </table>
                
                <h4>Ser vs Estar 的区别</h4>
                <p>这是西语学习的经典难点：</p>
                <ul>
                    <li><strong>Ser</strong> — 用于本质、永久特征：Soy alto.（我个子高。）Es médico.（他是医生。）</li>
                    <li><strong>Estar</strong> — 用于状态、位置、临时情况：Estoy cansado.（我累了。）Está en casa.（他在家。）</li>
                </ul>
                
                <h4>实用表达</h4>
                <ul>
                    <li><strong>Tengo hambre.</strong> — 我饿了。（字面：我有饥饿）</li>
                    <li><strong>Tengo sed.</strong> — 我渴了。</li>
                    <li><strong>Tengo 20 años.</strong> — 我20岁。</li>
                    <li><strong>¿Dónde estás?</strong> — 你在哪里？</li>
                    <li><strong>Estoy bien, gracias.</strong> — 我很好，谢谢。</li>
                </ul>
            `,
            words: ['tener', 'tengo', 'estar', 'estoy', 'hambre', 'sed', 'años', 'cansado', 'enfermo', 'ocupado'],
            examples: [
                { es: 'Tengo 25 años.', cn: '我25岁。' },
                { es: '¿Dónde estás? Estoy en casa.', cn: '你在哪里？我在家。' },
                { es: 'Tengo hambre. Quiero comer.', cn: '我饿了。我想吃饭。' }
            ]
        },
        {
            id: 'A1-08',
            title: '第8课：日常会话与综合复习',
            grammar: `
                <h3>💬 日常会话表达</h3>
                
                <h4>疑问词</h4>
                <ul>
                    <li><strong>¿Qué?</strong> — 什么？</li>
                    <li><strong>¿Quién?</strong> — 谁？</li>
                    <li><strong>¿Dónde?</strong> — 哪里？</li>
                    <li><strong>¿Cuándo?</strong> — 什么时候？</li>
                    <li><strong>¿Por qué?</strong> — 为什么？</li>
                    <li><strong>¿Cómo?</strong> — 怎么样？</li>
                    <li><strong>¿Cuánto?</strong> — 多少？</li>
                </ul>
                
                <h4>常用短语</h4>
                <ul>
                    <li><strong>¿Qué tal?</strong> — 怎么样？</li>
                    <li><strong>Muy bien</strong> — 很好</li>
                    <li><strong>Más o menos</strong> — 一般般</li>
                    <li><strong>Lo siento</strong> — 对不起</li>
                    <li><strong>No pasa nada</strong> — 没关系</li>
                    <li><strong>De nada</strong> — 不客气</li>
                    <li><strong>Por favor</strong> — 请</li>
                    <li><strong>Perdón</strong> — 抱歉/打扰一下</li>
                </ul>
                
                <h4>动词 querer（想要）</h4>
                <p>另一个重要的不规则动词：</p>
                <table class="conjugation-table">
                    <tr><th>人称</th><th>变位</th></tr>
                    <tr><td>yo</td><td><strong>quiero</strong></td></tr>
                    <tr><td>tú</td><td><strong>quieres</strong></td></tr>
                    <tr><td>él/ella/usted</td><td><strong>quiere</strong></td></tr>
                    <tr><td>nosotros</td><td><strong>queremos</strong></td></tr>
                    <tr><td>vosotros</td><td><strong>queréis</strong></td></tr>
                    <tr><td>ellos/ellas/ustedes</td><td><strong>quieren</strong></td></tr>
                </table>
                
                <h4>A1阶段总结</h4>
                <p>恭喜你完成了A1阶段的学习！你已经掌握了：</p>
                <ul>
                    <li>✅ 西班牙语字母和发音规则</li>
                    <li>✅ 基本问候和自我介绍</li>
                    <li>✅ 名词的性和数</li>
                    <li>✅ -AR, -ER, -IR 动词现在时变位</li>
                    <li>✅ 形容词的性数配合</li>
                    <li>✅ 动词 ser, estar, tener 的用法</li>
                    <li>✅ 基础词汇约50个</li>
                    <li>✅ 日常会话基本表达</li>
                </ul>
                <p>现在可以进入A2阶段的学习了！🎉</p>
            `,
            words: ['querer', 'quiero', 'por qué', 'porque', 'cuándo', 'quién', 'lo siento', 'de nada', 'perdón', 'más o menos'],
            examples: [
                { es: '¿Qué quieres comer? Quiero paella.', cn: '你想吃什么？我想吃海鲜饭。' },
                { es: '¿Por qué estudias español? Porque me gusta.', cn: '你为什么学西班牙语？因为我喜欢。' },
                { es: 'Lo siento, no entiendo.', cn: '对不起，我不明白。' }
            ]
        }
    ]
};

// ===== A1阶段完整词汇表 (约50个) =====
const VOCABULARY = {
    A1: [
        { es: 'hola', cn: '你好', lesson: 'A1-01', example: '¡Hola! ¿Cómo estás?' },
        { es: 'adiós', cn: '再见', lesson: 'A1-01', example: 'Adiós, hasta mañana.' },
        { es: 'gracias', cn: '谢谢', lesson: 'A1-01', example: 'Muchas gracias.' },
        { es: 'por favor', cn: '请', lesson: 'A1-01', example: 'Un café, por favor.' },
        { es: 'sí', cn: '是的', lesson: 'A1-01', example: 'Sí, claro.' },
        { es: 'no', cn: '不/不是', lesson: 'A1-01', example: 'No, gracias.' },
        { es: 'buenos días', cn: '早上好', lesson: 'A1-01', example: '¡Buenos días!' },
        { es: 'buenas noches', cn: '晚上好/晚安', lesson: 'A1-01', example: 'Buenas noches, que descanses.' },
        { es: 'me llamo', cn: '我叫...', lesson: 'A1-02', example: 'Me llamo Carlos.' },
        { es: 'mucho gusto', cn: '很高兴认识你', lesson: 'A1-02', example: 'Mucho gusto.' },
        { es: 'soy', cn: '我是 (ser)', lesson: 'A1-02', example: 'Soy estudiante.' },
        { es: 'eres', cn: '你是 (ser)', lesson: 'A1-02', example: '¿Eres español?' },
        { es: 'es', cn: '他/她是 (ser)', lesson: 'A1-02', example: 'Ella es médica.' },
        { es: 'de', cn: '从/来自', lesson: 'A1-02', example: 'Soy de China.' },
        { es: 'y', cn: '和/与', lesson: 'A1-02', example: 'Tú y yo.' },
        { es: 'tú', cn: '你', lesson: 'A1-02', example: 'Tú eres amable.' },
        { es: 'usted', cn: '您', lesson: 'A1-02', example: 'Usted es profesor.' },
        { es: 'cómo', cn: '怎么样/如何', lesson: 'A1-02', example: '¿Cómo estás?' },
        { es: 'el libro', cn: '书', lesson: 'A1-03', example: 'El libro es rojo.' },
        { es: 'la casa', cn: '房子', lesson: 'A1-03', example: 'La casa es grande.' },
        { es: 'el perro', cn: '狗', lesson: 'A1-03', example: 'El perro corre.' },
        { es: 'la mesa', cn: '桌子', lesson: 'A1-03', example: 'La mesa es nueva.' },
        { es: 'un', cn: '一个（阳）', lesson: 'A1-03', example: 'Un amigo.' },
        { es: 'una', cn: '一个（阴）', lesson: 'A1-03', example: 'Una amiga.' },
        { es: 'el hombre', cn: '男人', lesson: 'A1-03', example: 'El hombre habla.' },
        { es: 'la mujer', cn: '女人', lesson: 'A1-03', example: 'La mujer trabaja.' },
        { es: 'el niño', cn: '男孩', lesson: 'A1-03', example: 'El niño estudia.' },
        { es: 'la niña', cn: '女孩', lesson: 'A1-03', example: 'La niña canta.' },
        { es: 'hablar', cn: '说话', lesson: 'A1-04', example: 'Yo hablo español.' },
        { es: 'estudiar', cn: '学习', lesson: 'A1-04', example: 'Estudio en casa.' },
        { es: 'trabajar', cn: '工作', lesson: 'A1-04', example: 'Trabajo en Madrid.' },
        { es: 'escuchar', cn: '听', lesson: 'A1-04', example: 'Escucho música.' },
        { es: 'mirar', cn: '看', lesson: 'A1-04', example: 'Miro la televisión.' },
        { es: 'comprar', cn: '买', lesson: 'A1-04', example: 'Compro fruta.' },
        { es: 'tomar', cn: '拿/喝', lesson: 'A1-04', example: 'Tomo café.' },
        { es: 'llegar', cn: '到达', lesson: 'A1-04', example: 'Llego a casa.' },
        { es: 'mucho', cn: '很多', lesson: 'A1-04', example: 'Estudio mucho.' },
        { es: 'un poco', cn: '一点点', lesson: 'A1-04', example: 'Hablo un poco.' },
        { es: 'comer', cn: '吃', lesson: 'A1-05', example: 'Como arroz.' },
        { es: 'vivir', cn: '居住/生活', lesson: 'A1-05', example: 'Vivo en China.' },
        { es: 'beber', cn: '喝', lesson: 'A1-05', example: 'Bebo agua.' },
        { es: 'escribir', cn: '写', lesson: 'A1-05', example: 'Escribo una carta.' },
        { es: 'leer', cn: '读', lesson: 'A1-05', example: 'Leo un libro.' },
        { es: 'compartir', cn: '分享', lesson: 'A1-05', example: 'Comparto la comida.' },
        { es: 'dónde', cn: '哪里', lesson: 'A1-05', example: '¿Dónde vives?' },
        { es: 'qué', cn: '什么', lesson: 'A1-05', example: '¿Qué comes?' },
        { es: 'aquí', cn: '这里', lesson: 'A1-05', example: 'Aquí está.' },
        { es: 'allí', cn: '那里', lesson: 'A1-05', example: 'Allí está.' },
        { es: 'bueno', cn: '好的', lesson: 'A1-06', example: 'Bueno idea.' },
        { es: 'malo', cn: '坏的', lesson: 'A1-06', example: 'Malo tiempo.' },
        { es: 'grande', cn: '大的', lesson: 'A1-06', example: 'Casa grande.' },
        { es: 'pequeño', cn: '小的', lesson: 'A1-06', example: 'Perro pequeño.' },
        { es: 'bonito', cn: '漂亮的', lesson: 'A1-06', example: 'Flor bonita.' },
        { es: 'rojo', cn: '红色的', lesson: 'A1-06', example: 'Coche rojo.' },
        { es: 'azul', cn: '蓝色的', lesson: 'A1-06', example: 'Cielo azul.' },
        { es: 'verde', cn: '绿色的', lesson: 'A1-06', example: 'Árbol verde.' },
        { es: 'blanco', cn: '白色的', lesson: 'A1-06', example: 'Casa blanca.' },
        { es: 'negro', cn: '黑色的', lesson: 'A1-06', example: 'Gato negro.' },
        { es: 'tener', cn: '有', lesson: 'A1-07', example: 'Tengo un libro.' },
        { es: 'tengo', cn: '我有', lesson: 'A1-07', example: 'Tengo hambre.' },
        { es: 'estar', cn: '在/处于', lesson: 'A1-07', example: 'Estoy en casa.' },
        { es: 'estoy', cn: '我在', lesson: 'A1-07', example: 'Estoy bien.' },
        { es: 'hambre', cn: '饥饿', lesson: 'A1-07', example: 'Tengo hambre.' },
        { es: 'sed', cn: '口渴', lesson: 'A1-07', example: 'Tengo sed.' },
        { es: 'años', cn: '岁/年', lesson: 'A1-07', example: 'Tengo 20 años.' },
        { es: 'cansado', cn: '累的', lesson: 'A1-07', example: 'Estoy cansado.' },
        { es: 'enfermo', cn: '生病的', lesson: 'A1-07', example: 'Está enfermo.' },
        { es: 'ocupado', cn: '忙的', lesson: 'A1-07', example: 'Estoy ocupado.' },
        { es: 'querer', cn: '想要', lesson: 'A1-08', example: 'Quiero comer.' },
        { es: 'quiero', cn: '我想要', lesson: 'A1-08', example: 'Quiero agua.' },
        { es: 'por qué', cn: '为什么', lesson: 'A1-08', example: '¿Por qué?' },
        { es: 'porque', cn: '因为', lesson: 'A1-08', example: 'Porque sí.' },
        { es: 'cuándo', cn: '什么时候', lesson: 'A1-08', example: '¿Cuándo vienes?' },
        { es: 'quién', cn: '谁', lesson: 'A1-08', example: '¿Quién eres?' },
        { es: 'lo siento', cn: '对不起', lesson: 'A1-08', example: 'Lo siento mucho.' },
        { es: 'de nada', cn: '不客气', lesson: 'A1-08', example: 'De nada.' },
        { es: 'perdón', cn: '抱歉/打扰', lesson: 'A1-08', example: 'Perdón, ¿dónde está?' },
        { es: 'más o menos', cn: '一般般', lesson: 'A1-08', example: 'Más o menos.' }
    ]
};

// ===== 测验题库 =====
const QUIZ_DATA = {
    A1: [
        // 西译中
        {
            question: '¿Qué significa "hola"?',
            options: ['你好', '再见', '谢谢', '请'],
            answer: 0,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "gracias"?',
            options: ['你好', '再见', '谢谢', '对不起'],
            answer: 2,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "adiós"?',
            options: ['你好', '再见', '谢谢', '请'],
            answer: 1,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "casa"?',
            options: ['书', '房子', '桌子', '狗'],
            answer: 1,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "libro"?',
            options: ['书', '房子', '桌子', '笔'],
            answer: 0,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "perro"?',
            options: ['猫', '狗', '鸟', '鱼'],
            answer: 1,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "comer"?',
            options: ['喝', '吃', '睡', '跑'],
            answer: 1,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "hablar"?',
            options: ['听', '看', '说话', '写'],
            answer: 2,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "grande"?',
            options: ['小的', '好的', '大的', '坏的'],
            answer: 2,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "rojo"?',
            options: ['蓝色', '红色', '绿色', '白色'],
            answer: 1,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "tener"?',
            options: ['是', '在', '有', '想要'],
            answer: 2,
            direction: 'es2cn'
        },
        {
            question: '¿Qué significa "estoy bien"?',
            options: ['我很好', '我不好', '我累了', '我饿了'],
            answer: 0,
            direction: 'es2cn'
        },
        // 中译西
        {
            question: '"你好" 用西班牙语怎么说？',
            options: ['Adiós', 'Gracias', 'Hola', 'Por favor'],
            answer: 2,
            direction: 'cn2es'
        },
        {
            question: '"谢谢" 用西班牙语怎么说？',
            options: ['Hola', 'Gracias', 'Adiós', 'Sí'],
            answer: 1,
            direction: 'cn2es'
        },
        {
            question: '"再见" 用西班牙语怎么说？',
            options: ['Hola', 'Gracias', 'Adiós', 'Sí'],
            answer: 2,
            direction: 'cn2es'
        },
        {
            question: '"房子" 用西班牙语怎么说？',
            options: ['Libro', 'Casa', 'Mesa', 'Perro'],
            answer: 1,
            direction: 'cn2es'
        },
        {
            question: '"书" 用西班牙语怎么说？',
            options: ['Casa', 'Libro', 'Mesa', 'Silla'],
            answer: 1,
            direction: 'cn2es'
        },
        {
            question: '"吃" 用西班牙语怎么说？',
            options: ['Beber', 'Comer', 'Dormir', 'Correr'],
            answer: 1,
            direction: 'cn2es'
        },
        {
            question: '"说话" 用西班牙语怎么说？',
            options: ['Escuchar', 'Mirar', 'Hablar', 'Escribir'],
            answer: 2,
            direction: 'cn2es'
        },
        {
            question: '"大的" 用西班牙语怎么说？',
            options: ['Pequeño', 'Grande', 'Bueno', 'Malo'],
            answer: 1,
            direction: 'cn2es'
        },
        {
            question: '"红色" 用西班牙语怎么说？',
            options: ['Azul', 'Verde', 'Rojo', 'Negro'],
            answer: 2,
            direction: 'cn2es'
        },
        {
            question: '"有" 用西班牙语怎么说？',
            options: ['Ser', 'Estar', 'Tener', 'Querer'],
            answer: 2,
            direction: 'cn2es'
        },
        // 动词变位题
        {
            question: 'Yo _____ español. (hablar)',
            options: ['hablo', 'hablas', 'habla', 'hablamos'],
            answer: 0,
            direction: 'conjugation'
        },
        {
            question: 'Tú _____ español. (hablar)',
            options: ['hablo', 'hablas', 'habla', 'hablamos'],
            answer: 1,
            direction: 'conjugation'
        },
        {
            question: 'Él _____ en Madrid. (vivir)',
            options: ['vivo', 'vives', 'vive', 'vivimos'],
            answer: 2,
            direction: 'conjugation'
        },
        {
            question: 'Nosotros _____ arroz. (comer)',
            options: ['como', 'comes', 'come', 'comemos'],
            answer: 3,
            direction: 'conjugation'
        },
        {
            question: 'Ellos _____ en un hospital. (trabajar)',
            options: ['trabajo', 'trabajas', 'trabaja', 'trabajan'],
            answer: 3,
            direction: 'conjugation'
        },
        {
            question: 'Yo _____ 20 años. (tener)',
            options: ['tengo', 'tienes', 'tiene', 'tenemos'],
            answer: 0,
            direction: 'conjugation'
        },
        {
            question: 'Tú _____ de China. (ser)',
            options: ['soy', 'eres', 'es', 'somos'],
            answer: 1,
            direction: 'conjugation'
        },
        {
            question: 'Ella _____ en casa. (estar)',
            options: ['estoy', 'estás', 'está', 'estamos'],
            answer: 2,
            direction: 'conjugation'
        },
        {
            question: '"Soy" 对应哪个人称？',
            options: ['tú', 'él', 'yo', 'nosotros'],
            answer: 2,
            direction: 'cn2es'
        },
        {
            question: '"Son" 对应哪个人称？',
            options: ['yo', 'tú', 'él', 'ellos'],
            answer: 3,
            direction: 'cn2es'
        }
    ]
};

// ===== A1阶段综合复习题 =====
const REVIEW_DATA = {
    A1: {
        title: 'A1 阶段综合练习',
        questions: [
            {
                type: 'choice',
                question: '¿Qué significa "buenos días"?',
                options: ['下午好', '早上好', '晚上好', '你好'],
                answer: 1
            },
            {
                type: 'choice',
                question: '"女孩" 用西班牙语怎么说？',
                options: ['El niño', 'La niña', 'El hombre', 'La mujer'],
                answer: 1
            },
            {
                type: 'choice',
                question: '下面哪个是 -AR 动词？',
                options: ['Comer', 'Vivir', 'Hablar', 'Escribir'],
                answer: 2
            },
            {
                type: 'choice',
                question: '"Nosotros" 对应的动词变位词尾是？',
                options: ['-o', '-as', '-a', '-amos'],
                answer: 3
            },
            {
                type: 'choice',
                question: '下面哪个是阴性名词？',
                options: ['El libro', 'El perro', 'La mesa', 'El hombre'],
                answer: 2
            },
            {
                type: 'choice',
                question: '"Tengo hambre" 是什么意思？',
                options: ['我渴了', '我饿了', '我累了', '我病了'],
                answer: 1
            },
            {
                type: 'choice',
                question: '形容词放在名词的什么位置？',
                options: ['之前', '之后', '前后都可以', '不放在一起'],
                answer: 1
            },
            {
                type: 'choice',
                question: '"Estoy en casa" 是什么意思？',
                options: ['我在家', '我回家了', '我家很大', '我喜欢家'],
                answer: 0
            },
            {
                type: 'choice',
                question: '"Quiero" 的原形动词是？',
                options: ['Tener', 'Estar', 'Querer', 'Ser'],
                answer: 2
            },
            {
                type: 'choice',
                question: '以 -z 结尾的名词变复数时，-z 变成什么？',
                options: ['-ces', '-ses', '-zes', '-s'],
                answer: 0
            }
        ]
    }
};

