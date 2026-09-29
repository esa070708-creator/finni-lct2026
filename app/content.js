(function(root){
const products=[
 {id:'food',name:'Вкусный обед',price:12,kind:'needs',icon:'🥣',effect:{food:35},limit:3,desc:'Тёплый обед для новых открытий'},
 {id:'water',name:'Свежая вода',price:8,kind:'needs',icon:'💧',effect:{food:15,energy:5},limit:2,desc:'Попить после прогулки'},
 {id:'care',name:'Пенная ванна',price:14,kind:'needs',icon:'🛁',effect:{clean:35,joy:5},limit:3,desc:'Пена, пузырьки и чистые лапки'},
 {id:'bed',name:'Мягкая подушка',price:16,kind:'needs',icon:'🛏️',effect:{energy:40},limit:2,desc:'Немного отдыха перед приключением'},
 {id:'ball',name:'Прыгучий мяч',price:22,kind:'wants',icon:'⚽',effect:{joy:30},limit:2,desc:'Весёлый матч во дворе'},
 {id:'bow',name:'Яркий бантик',price:25,kind:'wants',icon:'🎀',effect:{joy:20},limit:1,desc:'Маленькая деталь большого настроения'},
 {id:'cookie',name:'Хрустящее печенье',price:15,kind:'wants',icon:'🍪',effect:{food:10,joy:15},limit:2,desc:'Угощение после обеда'},
 {id:'house',name:'Уютный домик',price:65,kind:'wants',icon:'🏠',effect:{joy:25,energy:15},once:true,limit:1,desc:'Свой уголок. Покупается один раз'}
];
const goals=[
 {id:'plant',name:'Сад на подоконнике',price:55,icon:'🪴',story:'Первый маленький сад в комнате Финни.'},
 {id:'robot',name:'Робот-друг',price:100,icon:'🤖',story:'Будет ждать тебя рядом с Финни.'},
 {id:'bike',name:'Первый велосипед',price:150,icon:'🚲',story:'Для больших прогулок и маленьких открытий.'},
 {id:'tent',name:'Походная палатка',price:180,icon:'⛺',story:'Ночь под звёздами у себя в комнате.'},
 {id:'guitar',name:'Своя гитара',price:210,icon:'🎸',story:'Сыграем первую песню вместе.'},
 {id:'telescope',name:'Звёздный телескоп',price:240,icon:'🔭',story:'Вселенная становится чуть ближе.'},
 {id:'hero',name:'Костюм героя',price:270,icon:'🦸',story:'За разумными решениями — настоящая суперсила.'},
 {id:'rocket',name:'Модель ракеты',price:320,icon:'🚀',story:'Большая мечта для терпеливого исследователя.'},
 {id:'piano',name:'Мини-пианино',price:390,icon:'🎹',story:'Целый концерт в комнате Финни.'},
 {id:'castle',name:'Сказочный замок',price:480,icon:'🏰',story:'Много маленьких шагов ради большой мечты.'}
];
const chapters=[['Первые открытия','Учимся выбирать нужное и оставлять монеты на мечту.','🌱'],['Лавка на площади','Собираем покупки и проверяем сдачу.','🛍️'],['Пикник у озера','Планируем отдых и оставляем запас.','🧺'],['Мастерская мечты','Сравниваем цены и собираем свой план.','🛠️'],['Космическая неделя','Копим на большое и замечаем лишние траты.','🪐'],['Праздник друзей','Планируем подарки без лишних расходов.','🎁'],['Поход в горы','Готовимся к неожиданностям и считаем запас.','⛰️'],['Город открытий','Применяем всё, чему научились.','🌇']];
function tasks(period){const k=(period-1)%12,n=period;const total=60+5*k,required=25+5*(k%3),want=15+5*(k%2),goal=100+10*k,have=30+5*k,change=40+5*k,price=15+5*(k%4);const prefix='p'+n+'-';const scene=[['Неожиданный дождь','Финни промочил лапки','уход'],['Разбитая миска','Миска Финни треснула','новую миску'],['Запас для пикника','На пикнике закончилась вода','воду'],['Ремонт мастерской','У рабочего стола сломалась ножка','ремонт'],['Космический запас','Для экспедиции нужен запас еды','еду'],['Праздник без спешки','Для гостей не хватает питьевой воды','воду'],['Промокший рюкзак','В походе промокла подстилка','сухую подстилку'],['Важная остановка','После прогулки Финни нужен обед','обед']][(period-1)%8];const expense=12+2*(k%5),pocket=expense+6+(k%3),plannedSave=25+5*(k%4),over=5+5*(k%3);
const sortSets=[['Корм','🥣','Бантик','🎀','Вода','💧','Украшение','🎈'],['Обед','🥣','Робот','🤖','Мыло','🧼','Наклейки','⭐'],['Вода','💧','Мяч','⚽','Еда для пикника','🥪','Воздушный змей','🪁'],['Мыло','🧼','Гитара','🎸','Чистая подстилка','🛏️','Фигурка','🧸']][k%4];
return [
 {id:prefix+'sort',index:0,type:'sort',title:'Нужно или хочется?',topic:'Выбор',reward:5,level:'Разминка',deps:[],text:'Разложи четыре покупки. Нужное помогает заботиться о Финни. Желания могут подождать.',items:[0,1,2,3].map(i=>({name:sortSets[i*2],icon:sortSets[i*2+1],answer:i%2?'wants':'needs'})),why:'Еда, вода, чистота и отдых нужны для заботы. Игрушки и украшения могут подождать.'},
 {id:prefix+'math',index:1,type:'number',title:'Монеты на мечту',topic:'Накопления',reward:12,level:'Задача',deps:[0],text:`Мечта стоит ${goal} монет. Ты уже накопил ${have}. Сколько ещё нужно?`,answer:goal-have,why:`${goal} − ${have} = ${goal-have}. Это оставшаяся сумма до мечты.`},
 {id:prefix+'coins',index:2,type:'coins',title:'Касса Финни',topic:'Покупки',reward:7,level:'Мини-игра',deps:[1],text:`Собери ровно ${price} монет для покупки. Нажимай на монеты — они попадут на прилавок.`,target:price,denominations:[1,5,10,20],answer:price,why:`Цена — ${price} монет. Точная сумма помогает проверить оплату.`},
 {id:prefix+'basket',index:3,type:'basket',title:'Корзина без лишнего',topic:'Покупки',reward:9,level:'Мини-игра',deps:[1],text:`Есть ${required+10} монет. Корм и вода нужны сегодня. Собери корзину, которая тебе по силам.`,budget:required+10,options:[{name:'Корм',icon:'🥣',price:required-10,required:true},{name:'Вода',icon:'💧',price:10,required:true},{name:'Мяч',icon:'⚽',price:20},{name:'Наклейка',icon:'⭐',price:5}],why:'Сначала корм и вода. Если после них остались деньги, наклейку можно купить или сохранить остаток.'},
 {id:prefix+'plan',index:4,type:'allocation',title:'План для приключения',topic:'Бюджет',reward:18,level:'Вызов',deps:[2,3],text:`Распредели ${total} монет. На нужное требуется не меньше ${required}, на мечту — не меньше 10. Желания выбираешь ты.`,total,minimum:[required,0,10],why:`Сначала ${required} или больше на нужное, затем не меньше 10 в копилку. Остальное распределяешь сам.`},
 {id:prefix+'reserve',index:5,type:'choice',title:scene[0],topic:'Запас',reward:13,level:'История',deps:[4],text:`${scene[1]}. На ${scene[2]} нужно ${expense} монет. У тебя ${pocket} свободных, а в планах игрушка за ${pocket}. Что сделаем?`,options:[`Купим ${scene[2]} за ${expense}, игрушку перенесём`,`Купим игрушку за ${pocket}, на остальное хватит`,`Потратим ${pocket+expense}, хотя у нас ${pocket}`],answer:0,why:`После нужной покупки останется ${pocket-expense} монет. Перенести желание ради нужного — разумный выбор.`},
 {id:prefix+'change',index:6,type:'coins',title:'Сдача без ошибки',topic:'Покупки',reward:10,level:'Мини-игра',deps:[5],text:`Ты отдал ${change} монет за покупку ценой ${price}. Верни себе правильную сдачу с помощью монет.`,target:change-price,denominations:[1,5,10,20],answer:change-price,why:`${change} − ${price} = ${change-price}. Всегда можно пересчитать сдачу до покупки.`},
 {id:prefix+'final',index:7,type:'number',title:'Детектив бюджета',topic:'План и факт',reward:20,level:'Финал',deps:[6],text:`Ты планировал ${want} монет на желания и ${plannedSave} в копилку. На желания ушло ${want+over}. Доход не изменился. Сколько теперь получится отложить вместо ${plannedSave}?`,answer:plannedSave-over,why:`На желания ушло на ${over} больше. В копилку осталось ${plannedSave} − ${over} = ${plannedSave-over}. Следующий план можно уточнить.`}
];}
const C={products,goals,chapters,tasks,stats:[['food','Сытость','🥣'],['clean','Чистота','🫧'],['energy','Бодрость','⚡'],['joy','Радость','☀']],stages:['Малыш','Подросток','Герой'],income:25,start:35};
if(typeof module!=='undefined')module.exports=C;else root.CONTENT=C;
})(typeof window!=='undefined'?window:globalThis);
